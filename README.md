# ArrayForms - Professional Bulk Email Sender

A modern, secure, and user-friendly bulk email sending application built with Flask. Send personalized emails to multiple recipients with rich text formatting, file attachments, and a beautiful, responsive interface.

![ArrayForms Interface](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![Python](https://img.shields.io/badge/Python-3.9+-blue)
![Flask](https://img.shields.io/badge/Flask-2.3+-lightgrey)
![License](https://img.shields.io/badge/License-MIT-green)

## ✨ Features

- **Secure Email Sending**: Your credentials are never stored on our servers
- **Personalized Emails**: Each recipient gets an individual email for better privacy
- **Rich Text Editor**: Advanced formatting with bold, italic, underline, headings, lists, and more
- **Font Customization**: Choose from multiple font families and sizes
- **File Attachments**: Support for PDF, DOC, DOCX, TXT, JPG, PNG, GIF files
- **HTML Support**: Rich email formatting with sanitized HTML content
- **Real-time Progress**: Track sending progress with visual indicators
- **Mobile Optimized**: Fully responsive design for all devices
- **Smart Rate Limiting**: Respects email provider limits for optimal deliverability
- **Modern UI**: Beautiful gradient design with smooth animations
- **Gmail App Password Support**: Secure authentication for Gmail accounts
- **Drag & Drop**: Easy file upload with drag and drop functionality

## 🛠️ Local Development

### Prerequisites

- Python 3.9 or higher
- pip (Python package installer)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/arrayforms-bulk-mailer.git
   cd arrayforms-bulk-mailer
   ```

2. **Create a virtual environment**:
   ```bash
   python -m venv venv
   
   # On Windows
   venv\Scripts\activate
   
   # On macOS/Linux
   source venv/bin/activate
   ```

3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Set environment variables**:
   ```bash
   # On Windows
   set SECRET_KEY=your-secret-key-here
   
   # On macOS/Linux
   export SECRET_KEY=your-secret-key-here
   ```

5. **Run the application**:
   ```bash
   python app.py
   ```

6. **Open your browser** and go to: `http://localhost:5000`

## 📧 Email Provider Setup

### Gmail Setup (Recommended)

1. **Enable 2-Factor Authentication** on your Google account
2. **Generate an App Password**:
   - Go to Google Account Settings → Security
   - Under "2-Step Verification", click "App passwords"
   - Select "Mail" and your device
   - Copy the generated 16-character password
3. **Use the App Password** in the application (not your regular Gmail password)

### Other Email Providers

- **Yahoo**: Use your regular password or generate an app-specific password
- **Outlook/Hotmail**: Use your regular password
- **Custom SMTP**: Configure your own SMTP server settings

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `SECRET_KEY` | Flask secret key for sessions | Auto-generated |
| `PORT` | Port to run the application on | 5000 |
| `DEBUG` | Enable debug mode | False |

### Email Limits

- **Maximum recipients per campaign**: 10
- **Gmail limits**: 20 emails/hour, 500 emails/day
- **Other providers**: Varies by provider

### File Upload Limits

- **Maximum file size**: 16MB per file
- **Supported formats**: PDF, DOC, DOCX, TXT, JPG, JPEG, PNG, GIF
- **Multiple files**: Upload multiple files at once

## 🎨 Customization

### Styling

The application uses CSS custom properties for easy theming. Edit `static/css/styles.css` to customize:

- Colors and gradients
- Typography
- Spacing and layout
- Animations and transitions

### Features

- Add new email providers in `app.py` → `get_smtp_settings()`
- Modify email validation rules in `EmailForm` class
- Customize HTML sanitization in `send_emails()` function
- Extend rich text editor functionality in `static/js/script.js`

## 🔒 Security Features

- **No Data Storage**: Credentials are never stored on the server
- **HTML Sanitization**: Prevents XSS attacks in email content
- **Input Validation**: Comprehensive form validation
- **Rate Limiting**: Respects email provider limits
- **Secure Headers**: CSRF protection and secure session handling
- **File Validation**: Secure file upload with type and size restrictions

## 📱 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -am 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Issues**: Report bugs on GitHub Issues
- **Documentation**: Check the inline code comments for detailed explanations

---

**Made with ❤️ for the community**
