# ArrayForms - Bulk Email Sender

A Flask-based bulk email sending application with rich text formatting and file attachments.

## Features

- **Rich Text Editor**: Bold, italic, underline, headings, lists, fonts
- **File Attachments**: PDF, DOC, DOCX, TXT, JPG, PNG, GIF files
- **Secure**: Credentials never stored on server
- **Responsive**: Works on all devices
- **Gmail Support**: App password authentication

## Quick Start

1. **Clone and setup**:
   ```bash
   git clone https://github.com/yourusername/arrayforms-bulk-mailer.git
   cd arrayforms-bulk-mailer
   python -m venv venv
   venv\Scripts\activate  # Windows
   # source venv/bin/activate  # macOS/Linux
   pip install -r requirements.txt
   ```

2. **Run the app**:
   ```bash
   python app.py
   ```

3. **Open browser**: `http://localhost:5000`

## Gmail Setup

1. Enable 2-Factor Authentication
2. Generate App Password: Google Account → Security → App passwords
3. Use the App Password (not your regular password)

## File Limits

- **Size**: 16MB per file
- **Formats**: PDF, DOC, DOCX, TXT, JPG, PNG, GIF
- **Recipients**: Max 10 per campaign

## License

MIT License
