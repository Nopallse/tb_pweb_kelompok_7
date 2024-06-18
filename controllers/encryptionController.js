const crypto = require('crypto');

const algorithm = 'aes-256-cbc';
const key = Buffer.from("2a2f3dd6dc1b4b245a4c18968391e18c8921233becb891e3945f7a6bf1748be6", 'hex'); // Ensure the key is 32 bytes
const iv = Buffer.from("d06b1af282bc4d5453937d6068365821", 'hex'); // Ensure the IV is 16 bytes

function encrypt(text) {
  let cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return `${iv.toString('hex')}:${encrypted}`;
}

function decrypt(text) {
  let textParts = text.split(':');
  let iv = Buffer.from(textParts.shift(), 'hex');
  let encryptedText = textParts.join(':');
  let decipher = crypto.createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

module.exports = { decrypt, encrypt };

