const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

// Todo.remove({}).then(console.log)



Todo.findByIdAndRemove('5c30037dbef930e743b45218').then(console.log)