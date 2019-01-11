const {MongoClient, ObjectID} = require('mongodb')

const obj = new ObjectID()
console.log(obj)

const databaseURL = 'mongodb://localhost:27017/ToDoApp'

MongoClient.connect(databaseURL, (err, client) => {
	if(err) {
		return console.log('Unable to connect to MongoDB server', err)
	}
	console.log("Connected to MongoDB server")
	const db = client.db("ToDoApp")

	// db.collection('Todos').insertOne({
	// 	text: 'A thing to do',
	// 	completed: false
	// }, (err, result) => {
	// 	if(err) {
	// 		return console.log('Unable to insert todo', err)
	// 	}
	// 	console.log(JSON.stringify(result.ops, undefined, 2))
	// })

	// db.collection('Users').insertOne({
	// 	name: 'Shawn',
	// 	age: '23',
	// 	location: 'Brampton'
	// }, (err, result) => {
	// 	if(err) {
	// 		return console.log('Unable to insert user', err)
	// 	}
	// 	console.log(result.ops[0]._id.getTimestamp())
	// })

	client.close()
})