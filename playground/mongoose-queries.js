const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

const id = '5c2feefdcd49f22950318528';

if(!ObjectID.isValid(id)) {
	console.log("Id not valid");
}

// Todo.find({
// 	_id: id,
// }).then(todos => {
// 	console.log('find\n', todos)
// });


// Todo.findOne({
// 	_id: id,
// }).then(todo => {
// 	console.log('findOne\n', todo)
// });

// Todo.findById(id).then(todo => {
// 	if(!todo) {
// 		return console.log('Todo not found')
// 	}
// 	console.log('findById\n', todo)
// }).catch(console.log)

const userId = '5c2e8544f363242320ca76cf';

User.findById(userId).then(user => {
	if(!user) {
		return console.log('User not found')
	}
	console.log(user)
}).catch(console.log)
//User not found
//User was found
//Errors