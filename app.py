import urllib.parse
import werkzeug.urls

# --- FIX FOR WERKZEUG / FLASK-WTF COMPATIBILITY ---
# Werkzeug >= 2.1 removed url_encode, Flask-WTF still tries to import it.
if not hasattr(werkzeug.urls, "url_encode"):
    werkzeug.urls.url_encode = urllib.parse.urlencode
# --------------------------------------------------

from flask import Flask, render_template, request, flash, redirect, url_for
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os
import re
import logging
import bleach
from flask_wtf import FlaskForm
from wtforms import StringField, TextAreaField, PasswordField
from wtforms.validators import DataRequired, Email, ValidationError

app = Flask(__name__)
# Use environment variable for secret key in production or generate a random one in development
app.secret_key = os.environ.get('SECRET_KEY', os.urandom(24))

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler("arrayforms.log"),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

# Email validation pattern
EMAIL_REGEX = re.compile(r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$")

class EmailForm(FlaskForm):
    """Form for sending bulk emails with validation"""
    
    def validate_emails(form, field):
        if not field.data.strip():
            raise ValidationError('Please enter at least one email address.')
        
        emails = [e.strip() for e in field.data.split(',') if e.strip()]
        
        if len(emails) > 10:
            raise ValidationError('Maximum 10 email recipients allowed.')
        
        invalid_emails = [email for email in emails if not EMAIL_REGEX.match(email)]
        if invalid_emails:
            raise ValidationError(f'Invalid email format: {", ".join(invalid_emails)}')
    
    sender_email = StringField('Your Email', validators=[
        DataRequired(message='Please enter your email address.'),
        Email(message='Please enter a valid email address.')
    ])
    
    sender_password = PasswordField('Email Password/App Password', validators=[
        DataRequired(message='Please enter your password or app password.')
    ])
    
    emails = TextAreaField('Recipient Emails', validators=[
        DataRequired(message='Please enter recipient email addresses.'),
        validate_emails
    ])
    
    subject = StringField('Subject', validators=[
        DataRequired(message='Please enter an email subject.')
    ])
    
    body = TextAreaField('Message', validators=[
        DataRequired(message='Please enter an email body.')
    ])

@app.route('/', methods=['GET', 'POST'])
def index():
    form = EmailForm()
    if request.method == 'POST' and form.validate_on_submit():
        return send_emails(form)
    return render_template('index.html', form=form)

@app.route('/gmail-help')
def gmail_help():
    return render_template('gmail_help.html')

def send_emails(form):
    """Process the email form and send emails to recipients"""
    
    sender_email = form.sender_email.data
    sender_password = form.sender_password.data
    raw_emails = form.emails.data
    subject = form.subject.data
    body = form.body.data
    
    recipients = [e.strip() for e in raw_emails.split(',') if e.strip()]
    smtp_settings = get_smtp_settings(sender_email)
    
    safe_html_body = bleach.clean(
        body,
        tags=['p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'a', 'img'],
        attributes={'a': ['href', 'target'], 'img': ['src', 'alt', 'width', 'height']}
    )
    
    success_count = 0
    failed_emails = []

    logger.info(f"Starting to send emails to {len(recipients)} recipients from {sender_email}")

    try:
        retry_count = 0
        max_retries = 3
        connected = False
        
        while not connected and retry_count < max_retries:
            try:
                server = smtplib.SMTP(smtp_settings['server'], smtp_settings['port'], timeout=10)
                server.starttls()
                connected = True
            except (smtplib.SMTPConnectError, smtplib.SMTPServerDisconnected) as e:
                retry_count += 1
                logger.warning(f"SMTP connection attempt {retry_count} failed: {str(e)}")
                if retry_count >= max_retries:
                    raise
        
        try:
            server.login(sender_email, sender_password)
            
            for recipient in recipients:
                try:
                    msg = MIMEMultipart('alternative')
                    msg['Subject'] = subject
                    msg['From'] = sender_email
                    msg['To'] = recipient
                    
                    text_part = MIMEText(body, 'plain')
                    html_part = MIMEText(safe_html_body, 'html')
                    msg.attach(text_part)
                    msg.attach(html_part)
                    
                    server.sendmail(sender_email, [recipient], msg.as_string())
                    success_count += 1
                    logger.info(f"Email sent to {recipient}")
                except Exception as e:
                    failed_emails.append(recipient)
                    logger.error(f"Failed to send email to {recipient}: {str(e)}")
            
            server.quit()
            
            if success_count == len(recipients):
                logger.info(f"All {success_count} emails sent successfully")
                return render_template('success.html', recipient_count=success_count)
            elif success_count > 0:
                logger.warning(f"Partially successful: {success_count} of {len(recipients)} emails sent")
                flash(f'Partially successful: {success_count} of {len(recipients)} emails sent. Failed recipients: {", ".join(failed_emails)}', 'warning')
                return redirect(url_for('index'))
            else:
                logger.error(f"Failed to send any emails")
                flash('Failed to send any emails.', 'danger')
                return redirect(url_for('index'))
                
        except smtplib.SMTPAuthenticationError as e:
            logger.error(f"Authentication error: {str(e)}")
            if 'gmail' in sender_email.lower() and ('Username and Password not accepted' in str(e) or 'BadCredentials' in str(e)):
                flash('Gmail authentication failed. You must use an App Password, not your regular Gmail password. '
                      'Go to Google Account > Security > App passwords to create one. '
                      'See instructions on the form below.', 'danger')
            else:
                flash(f'Authentication error: {str(e)}. Please check your email and password.', 'danger')
            return redirect(url_for('index'))
        finally:
            if 'server' in locals():
                try:
                    server.quit()
                except:
                    pass
    except Exception as e:
        logger.error(f"Error in send_emails: {str(e)}", exc_info=True)
        flash(f'Error connecting to email server: {str(e)}', 'danger')
        return redirect(url_for('index'))

@app.route('/send', methods=['POST'])
def send():
    return redirect(url_for('index'))

def get_smtp_settings(email):
    domain = email.split('@')[-1].lower()
    
    if 'gmail' in domain:
        return {'server': 'smtp.gmail.com', 'port': 587}
    elif 'yahoo' in domain:
        return {'server': 'smtp.mail.yahoo.com', 'port': 587}
    elif 'outlook' in domain or 'hotmail' in domain or 'live' in domain:
        return {'server': 'smtp.office365.com', 'port': 587}
    else:
        return {'server': f'smtp.{domain}', 'port': 587}

if __name__ == '__main__':
    app.run(debug=True)
