const {MongoClient, ObjectID} = require('mongodb')

const databaseURL = 'mongodb://localhost:27017/ToDoApp'

MongoClient.connect(databaseURL, (err, client) => {
	if(err) {
		return console.log(err)
	}
	const db = client.db("ToDoApp")
	console.log("Connected to MongoDB Server")
	
	//deleteMany
	// db.collection('Todos').deleteMany({text: 'Learn Node.js'}).then((result) => {
	// 	console.log(result)
	// })
	
	//deleteOne
	// db.collection('Todos').deleteOne({text: 'Learn Node.js'}).then(console.log)

	//findOneAndDelete
	// db.collection('Todos').findOneAndDelete({completed: false}).then(console.log)

	//Challenge
	db.collection('Users').deleteMany({name: 'Shawn'}).then(console.log)
	db.collection('Users').findOneAndDelete({_id: new ObjectID('5b8e4eda4b6a9654f8584d83')}).then(console.log)

//	client.close()
})