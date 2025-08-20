"""
Compatibility module to handle Werkzeug API changes
"""

try:
    # Try to import from newer Werkzeug
    from werkzeug.urls import url_parse, url_encode, url_unparse, url_decode
except ImportError:
    # Fallback for newer Werkzeug versions
    from werkzeug.urls import url_parse, url_unparse, url_decode
    from urllib.parse import urlencode as url_encode

# Export the symbols
__all__ = ['url_parse', 'url_encode', 'url_unparse', 'url_decode']
