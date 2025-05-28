import CryptoJS from 'crypto-js';

export const encrypt = (data: string, key: string): string => {
  try {
    const ciphertext = CryptoJS.AES.encrypt(data, key).toString();
    return ciphertext;
  } catch (error) {
    console.error('Encryption error:', error);
    return '';
  }
};

export const decrypt = (ciphertext: string, key: string): string => {
  try {
    const bytes = CryptoJS.AES.decrypt(ciphertext, key);
    const originalText = bytes.toString(CryptoJS.enc.Utf8);
    return originalText;
  } catch (error) {
    console.error('Decryption error:', error);
    return '';
  }
};