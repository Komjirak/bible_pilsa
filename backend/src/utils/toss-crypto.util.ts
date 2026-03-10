import * as crypto from 'crypto';

/**
 * 토스 로그인 개인정보 복호화
 * 
 * @param encryptedBase64 토스측에서 전달받은 Base64 인코딩 암호문
 * @param keyBase64 발급받은 복호화 키 (Base64 형식)
 * @param aadStr 발급받은 AAD 문자열 (예: "TOSS")
 * @returns 복호화된 개인정보 텍스트 (예: 이메일, 전화번호 등)
 */
export function decryptTossData(
  encryptedBase64: string,
  keyBase64: string,
  aadStr: string,
): string {
  if (!encryptedBase64) return '';

  try {
    const key = Buffer.from(keyBase64, 'base64');
    const aad = Buffer.from(aadStr, 'utf8');

    // 토스 암호화 형식은 일반적으로 Base64( IV(12바이트) + Ciphertext + AuthTag(16바이트) )
    const buffer = Buffer.from(encryptedBase64, 'base64');

    if (buffer.length < 28) {
      throw new Error('Invalid Toss Encrypted Payload Length');
    }

    const iv = buffer.subarray(0, 12);
    // 끝에서 16바이트가 AuthTag 
    const authTag = buffer.subarray(buffer.length - 16);
    // IV와 AuthTag 사이가 실제 암호문(Ciphertext)
    const ciphertext = buffer.subarray(12, buffer.length - 16);

    const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
    decipher.setAAD(aad);
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(ciphertext, undefined, 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  } catch (err) {
    console.error('[Toss Crypto Error] 복호화 실패:', err.message);
    throw new Error('토스 로그인 개인정보 복호화에 실패했습니다.');
  }
}
