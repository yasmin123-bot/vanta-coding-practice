export const EMAIL_OTP_COOLDOWN_SECONDS = 60;
export const EMAIL_OTP_MAX_ATTEMPTS = 5;

const DIGIT_MAP: Record<string, string> = {
  '٠': '0', '١': '1', '٢': '2', '٣': '3', '٤': '4',
  '٥': '5', '٦': '6', '٧': '7', '٨': '8', '٩': '9',
  '۰': '0', '۱': '1', '۲': '2', '۳': '3', '۴': '4',
  '۵': '5', '۶': '6', '۷': '7', '۸': '8', '۹': '9',
};

export function normalizeEmailOtp(value: string): string {
  return [...value]
    .map((character) => DIGIT_MAP[character] ?? character)
    .join('')
    .replace(/[^0-9]/g, '')
    .slice(0, 6);
}

export function getEmailOtpCooldownSeconds(resendAt: number, now = Date.now()): number {
  return Math.max(0, Math.ceil((resendAt - now) / 1000));
}

export function isExpiredEmailOtpError(error: { code?: string; message?: string }): boolean {
  const code = error.code?.toLowerCase() ?? '';
  const message = error.message?.toLowerCase() ?? '';
  return code.includes('expired') || message.includes('expired') || message.includes('has expired');
}
