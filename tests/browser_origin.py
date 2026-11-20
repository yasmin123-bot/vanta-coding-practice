"""Strict local-origin validation for browser acceptance harnesses.

These scripts are intended to exercise local preview servers only. This helper
rejects remote hosts and URL prefixes that could otherwise pass startswith checks.
"""
from ipaddress import ip_address
import re
from urllib.parse import urlsplit


_URL_PATTERN = re.compile(r"https?://[^\s<>\"']+", re.IGNORECASE)
_PROTOCOL_RELATIVE_URL_PATTERN = re.compile(r"(?<![\w:])//[^\s<>\"']+")
_RELATIVE_URL_PATTERN = re.compile(r"(?<![<\w:/])/(?!/)[^\s<>\"']+")
_BEARER_PATTERN = re.compile(r'(?i)\bBearer\s+[A-Za-z0-9._~+/-]+=*')
_SECRET_KEYS = r'(?:access[_-]?token|refresh[_-]?token|id[_-]?token|token|password|passwd|secret|client[_-]?secret|(?:supabase[_-]?)?service[_-]?role(?:[_-]?key)?|(?:supabase[_-]?)?sb[_-]?secret[_-]?key?|api[_-]?key|apikey|otp|authorization)'
_SECRET_ASSIGNMENT_PATTERN = re.compile(
    r'''(?ix)(?P<key>["']?'''
    + _SECRET_KEYS
    + r'''["']?)(?P<separator>\s*[:=]\s*)(?P<value>"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|[^\s,;&}\]]+)'''
)


def _origin_parts(value):
    if not isinstance(value, str) or not value.strip():
        raise ValueError('A non-empty URL origin is required.')
    try:
        parsed = urlsplit(value.strip())
        scheme = parsed.scheme.lower()
        host = parsed.hostname
        port = parsed.port
    except ValueError as error:
        raise ValueError('The URL origin is malformed.') from error
    if scheme not in ('http', 'https') or not parsed.netloc or not host:
        raise ValueError('The URL origin must use HTTP or HTTPS and include a host.')
    if parsed.username is not None or parsed.password is not None:
        raise ValueError('Credentials are not allowed in a URL origin.')
    if parsed.netloc.endswith(':'):
        raise ValueError('The URL origin contains an invalid port.')
    return scheme, host.lower(), port if port is not None else (443 if scheme == 'https' else 80)


def validate_local_base_url(value):
    """Return BASE_URL trimmed to its origin, only when it targets loopback."""
    parts = _origin_parts(value)
    scheme, host, _port = parts
    raw = value.strip()
    parsed = urlsplit(raw)
    if parsed.path not in ('', '/') or parsed.query or parsed.fragment or '?' in raw or '#' in raw:
        raise ValueError('BASE_URL must be an origin, without a path, query, or fragment.')
    is_localhost = host == 'localhost'
    try:
        is_loopback_ip = ip_address(host).is_loopback
    except ValueError:
        is_loopback_ip = False
    if not (is_localhost or is_loopback_ip):
        raise ValueError('BASE_URL must use localhost or a loopback IP address.')
    return value.strip().rstrip('/')


def validate_test_mock_url(value):
    """Accept only an HTTPS .invalid origin for intercepted test-service calls."""
    scheme, host, _port = _origin_parts(value)
    raw = value.strip()
    parsed = urlsplit(raw)
    if scheme != 'https' or not host.endswith('.invalid') or parsed.path not in ('', '/') or parsed.query or parsed.fragment or '?' in raw or '#' in raw:
        raise ValueError('The mocked service URL must be an HTTPS .invalid origin.')
    return raw.rstrip('/')


def safe_origin_for_log(value):
    """Return only the URL origin for diagnostics, omitting credentials and path data."""
    try:
        parsed = urlsplit(value)
        scheme = parsed.scheme.lower()
        host = parsed.hostname
        port = parsed.port
    except (TypeError, ValueError):
        return '<invalid-origin>'
    if scheme not in ('http', 'https') or not host:
        return '<invalid-origin>'
    normalized_host = host.lower()
    if ':' in normalized_host:
        normalized_host = f'[{normalized_host}]'
    if port is not None:
        normalized_host = f'{normalized_host}:{port}'
    return f'{scheme}://{normalized_host}'


def sanitize_diagnostic_text(value):
    """Redact absolute/relative URL details and credential-shaped values from diagnostics."""
    text = str(value)
    text = _URL_PATTERN.sub(lambda match: safe_origin_for_log(match.group(0)), text)
    text = _PROTOCOL_RELATIVE_URL_PATTERN.sub('[redacted-url]', text)
    text = _RELATIVE_URL_PATTERN.sub('[redacted-url]', text)
    text = _BEARER_PATTERN.sub('Bearer [redacted]', text)
    def redact_assignment(match):
        key = match.group('key').strip('"\'')
        return f'{key}=[redacted]'
    return _SECRET_ASSIGNMENT_PATTERN.sub(redact_assignment, text)


def is_same_origin(url, expected_origin):
    """Compare scheme, hostname, and effective port; never use string prefixes."""
    try:
        return _origin_parts(url) == _origin_parts(expected_origin)
    except (TypeError, ValueError):
        return False
