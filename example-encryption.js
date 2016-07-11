var crypto = require('crypto-js');

var secretMesasge = {
	name: 'Eddie',
	secretName: 'Eddie Van Halen'
}
var secretKey = '123abc';

// Encrypt
var encryptedMessage = crypto.AES.encrypt(JSON.stringify(secretMesasge), secretKey);
console.log('Encrypted Message: '+encryptedMessage);

// Decrypt
var bytes = crypto.AES.decrypt(encryptedMessage, secretKey);
var decryptedMessage = JSON	.parse(bytes.toString(crypto.enc.Utf8));
console.log(decryptedMessage.secretName);