const {SHA256} = require('crypto-js');

let time1 = new Date();

let testPassword = 'tea';
let hash = SHA256(testPassword).toString();

let testNumber = 0;
let testStr = '';


do {
	testStr = '';
	let n = testNumber;
	let x = 1;
	let charCodes = [];
	while(75 ** x < n) {
		x++;
	}
	x--;
	while(n > 0) {
		charCodes.push((Math.floor(n / (75 ** x)) % 75) + 48);
		n -= Math.floor(n / (75 ** x));
		x--;
	}
	charCodes.forEach(z => {
		testStr += String.fromCharCode(z);
	});
	console.log(testStr);
	testNumber++;
} while(SHA256(testStr).toString() !== hash);

let time2 = new Date();

console.log('\n\nPASSWORD CRACKED:');
console.log(`Password:\t${testStr}`);
console.log(`Time taken:\t${(time2 - time1) / 1000} seconds`);
console.log(`Attempts made:\t${testNumber}`);