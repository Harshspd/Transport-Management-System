import crypto from 'crypto';

function generateJWTSecret() {
  return crypto.randomBytes(64).toString('hex');
}

console.log(generateJWTSecret());
