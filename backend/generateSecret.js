const crypto = require('crypto');

// Generate a random 64-byte hexadecimal string
const secret = crypto.randomBytes(64).toString('hex');

console.log('Generated JWT Secret:', secret);
