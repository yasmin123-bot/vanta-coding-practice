import unittest

from browser_origin import is_same_origin, safe_origin_for_log, sanitize_diagnostic_text, validate_local_base_url, validate_test_mock_url


class BrowserOriginTests(unittest.TestCase):
    def test_accepts_localhost_and_loopback_origins(self):
        self.assertEqual(validate_local_base_url('http://localhost:5175/'), 'http://localhost:5175')
        self.assertEqual(validate_local_base_url('http://127.0.0.1:4177'), 'http://127.0.0.1:4177')
        self.assertEqual(validate_local_base_url('https://[::1]:4177/'), 'https://[::1]:4177')

    def test_rejects_remote_or_url_prefix_bases(self):
        invalid_values = [
            'https://preview.example.com',
            'http://localhost.attacker.invalid',
            'http://127.0.0.1.attacker.invalid:5175',
            'http://localhost:5175.evil.invalid',
            'http://user:password@localhost:5175',
            'http://localhost:5175/app',
            'http://localhost:5175/?next=/app',
            'http://localhost:5175/#fragment',
            'http://localhost:5175?',
            'http://localhost:5175#',
            'http://localhost:not-a-port',
            'file:///tmp/mabda',
        ]
        for value in invalid_values:
            with self.subTest(value=value):
                with self.assertRaises(ValueError):
                    validate_local_base_url(value)

    def test_origin_comparison_checks_scheme_hostname_and_effective_port(self):
        expected = 'http://localhost:5175'
        self.assertTrue(is_same_origin('http://localhost:5175/paths/html-fundamentals', expected))
        self.assertTrue(is_same_origin('http://LOCALHOST:5175/assets/app.js', expected))
        self.assertFalse(is_same_origin('http://localhost.attacker.invalid:5175/path', expected))
        self.assertFalse(is_same_origin('http://localhost:51750/path', expected))
        self.assertFalse(is_same_origin('https://localhost:5175/path', expected))
        self.assertFalse(is_same_origin('http://127.0.0.1:5175/path', expected))
        self.assertFalse(is_same_origin('not a url', expected))

    def test_mock_service_must_use_an_https_invalid_origin(self):
        self.assertEqual(validate_test_mock_url('https://mabda-auth.invalid/'), 'https://mabda-auth.invalid')
        for value in (
            'http://mabda-auth.invalid',
            'https://supabase.co',
            'https://mabda-auth.invalid/path',
            'https://mabda-auth.invalid?',
            'https://mabda-auth.invalid#',
            'https://user:secret@mabda-auth.invalid',
        ):
            with self.subTest(value=value):
                with self.assertRaises(ValueError):
                    validate_test_mock_url(value)

    def test_safe_log_origin_omits_credentials_query_fragment_and_path(self):
        self.assertEqual(
            safe_origin_for_log('https://user:secret@example.invalid/private/token?key=value#fragment'),
            'https://example.invalid',
        )
        self.assertEqual(safe_origin_for_log('not a url'), '<invalid-origin>')

    def test_diagnostic_sanitizer_redacts_urls_bearer_and_secret_assignments(self):
        value = 'failed https://user:fixture@example.invalid/private/token?key=value#fragment password=fixture-value Bearer abc.def'
        sanitized = sanitize_diagnostic_text(value)
        self.assertEqual(sanitized, 'failed https://example.invalid password=[redacted] Bearer [redacted]')
        for sensitive in ('user:fixture', '/private/token', 'key=value', 'fixture-value', 'abc.def'):
            self.assertNotIn(sensitive, sanitized)

    def test_diagnostic_sanitizer_redacts_relative_and_protocol_relative_urls(self):
        value = 'request /private/path?code=fixture-code and /auth/otp/fixture-path and //example.invalid/private/path?key=fixture-key'
        sanitized = sanitize_diagnostic_text(value)
        self.assertEqual(sanitized, 'request [redacted-url] and [redacted-url] and [redacted-url]')
        for sensitive in ('/private/path', 'fixture-code', '/auth/otp/fixture-path', 'example.invalid', 'fixture-key'):
            self.assertNotIn(sensitive, sanitized)

    def test_diagnostic_sanitizer_redacts_quoted_and_common_secret_fields(self):
        value = '{"password":"two words", "client_secret":"client-fixture", "service_role_key":"role-fixture", "supabase_service_role_key":"sb-role-fixture"}'
        sanitized = sanitize_diagnostic_text(value)
        self.assertGreaterEqual(sanitized.count('[redacted]'), 4)
        for sensitive in ('two words', 'client-fixture', 'role-fixture', 'sb-role-fixture'):
            self.assertNotIn(sensitive, sanitized)


if __name__ == '__main__':
    unittest.main()
