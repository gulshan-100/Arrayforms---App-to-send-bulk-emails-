# ArrayForms - App to Send Bulk Emails

A simple SaaS tool to send bulk cold emails from the user's own email address. Built with Flask, Bootstrap, HTML, CSS, and JavaScript.

## Features

- Send bulk emails
- Each recipient receives an individual email (can't see other recipients)
- Use your own email address as the sender
- Simple and intuitive user interface
- CSRF protection for enhanced security
- Server side and client side validation
- HTML content sanitization to prevent XSS
- Support for formatted HTML content in emails
- Progress indicators for bulk sending
- Auto-detection of SMTP settings based on email domain
- Detailed Gmail app password instructions
- Connection retry logic for SMTP reliability

## Screenshot
<img width="857" height="789" alt="Screenshot 2025-08-21 042159" src="https://github.com/user-attachments/assets/daf83334-bd5c-4139-ba69-48947daee586" />


## Installation and Setup

1. Clone the repository
   ```
   git clone https://github.com/gulshan-100/arrayforms-bulk-mailer
   cd arrayforms-bulk-mailer
   ```

2. Install dependencies
   ```
   pip install -r requirements.txt
   ```

3. Run the application
   ```
   python app.py
   ```

4. Open your web browser and navigate to `http://127.0.0.1:5000`

## Important Notes

- For Gmail users: You need to use an [App Password](https://support.google.com/accounts/answer/185833) instead of your regular password
- The application doesn't store your email credentials; they're only used during the session to send emails
- Make sure to check your email provider's daily sending limits

## Security

- Your email password is never stored and is only used for sending emails through your email provider's SMTP server
- CSRF protection prevents cross-site request forgery attacks
- HTML content is sanitized to prevent cross-site scripting (XSS) attacks
- All form data is validated both on the client and server side
- Input validation prevents email injection attacks
- Comprehensive logging for troubleshooting and security auditing
- Secret key can be configured via environment variables
- HTTPS is strongly recommended for production deployment
