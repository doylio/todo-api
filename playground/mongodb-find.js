const {MongoClient, ObjectID} = require('mongodb')

const databaseURL = 'mongodb://localhost:27017/ToDoApp'

MongoClient.connect(databaseURL, (err, client) => {
	if(err) {
		return console.log(err)
	}
	const db = client.db("ToDoApp")

	db.collection('Todos').find({
		_id: new ObjectID("5c2d3f02c4433d268c67d91d")
	}).toArray().then((docs) => {
		console.log("Todos")
		console.log(JSON.stringify(docs, undefined, 2))
	}, (err) => {
		console.log(err)
	})

//	client.close()
})