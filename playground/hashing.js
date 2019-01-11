const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

let password = '1234abcd';

// bcrypt.genSalt(10, (err, salt) => {
// 	bcrypt.hash(password, salt, (err, hash) => {
// 		console.log(hash);
// 	});
// });

let hashedPassword = '$2a$10$0HmiWTBEmd.ifuev7xL06u7QnyZs0GfnOktA3o.UgCJiSnMhX93ci';

bcrypt.compare(password, hashedPassword, (err, result) => {
	console.log(result);
});


// let data = {
// 	id: 4
// };

// const token = jwt.sign(data, '123abc');
// console.log(token)

// const decoded = jwt.verify(token, '123abc');
// console.log(decoded);


// let token = {
// 	data,
// 	hash: SHA256(JSON.stringify(data) + 'salty-miner').toString()
// };

// token.data.id = 5;
// token.hash = SHA256(JSON.stringify(token.data)).toString();

// let resultHash = SHA256(JSON.stringify(token.data) + 'salty-miner').toString();

// if(resultHash == token.hash) {
// 	console.log('Data secure');
// } else {
// 	console.log('Data insecure!!!');
// }

