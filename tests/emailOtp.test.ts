import { describe, expect, it } from 'vitest';
import {
  EMAIL_OTP_COOLDOWN_SECONDS,
  EMAIL_OTP_MAX_ATTEMPTS,
  getEmailOtpCooldownSeconds,
  isExpiredEmailOtpError,
  normalizeEmailOtp,
} from '../src/utils/emailOtp';

describe('email OTP helpers', () => {
  it('normalizes Arabic and Persian numerals into a six-digit ASCII code', () => {
    expect(normalizeEmailOtp('١٢٣٤٥٦')).toBe('123456');
    expect(normalizeEmailOtp('۱۲۳۴۵۶')).toBe('123456');
  });

  it('keeps only digits and caps entry at six digits', () => {
    expect(normalizeEmailOtp('12-٣a45 67')).toBe('123456');
    expect(normalizeEmailOtp('12ab')).toBe('12');
  });

  it('uses the configured resend cooldown and attempt limit', () => {
    expect(EMAIL_OTP_COOLDOWN_SECONDS).toBe(60);
    expect(EMAIL_OTP_MAX_ATTEMPTS).toBe(5);
    expect(getEmailOtpCooldownSeconds(61_500, 1_000)).toBe(61);
    expect(getEmailOtpCooldownSeconds(999, 1_000)).toBe(0);
  });

  it('recognizes expired code errors without misclassifying other failures', () => {
    expect(isExpiredEmailOtpError({ code: 'otp_expired' })).toBe(true);
    expect(isExpiredEmailOtpError({ message: 'Token has expired' })).toBe(true);
    expect(isExpiredEmailOtpError({ code: 'invalid_token', message: 'Invalid code' })).toBe(false);
  });
});
