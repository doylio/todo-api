const {MongoClient, ObjectID} = require('mongodb')

const databaseURL = 'mongodb://localhost:27017/ToDoApp'

MongoClient.connect(databaseURL, (err, client) => {
	if(err) {
		return console.log(err)
	}
	const db = client.db("ToDoApp")
	console.log("Connected to MongoDB Server")
	
	// db.collection('Todos').findOneAndUpdate(
	// 	{_id: new ObjectID('5c2e7934bef930e743b4353f')},
	// 	{$set: {completed: true}},
	// 	{returnOriginal: false}
	// ).then(console.log)

	//Challenge:
	db.collection('Users').findOneAndUpdate(
		{_id: new ObjectID('5b8e4f26e419bd2fe0539789')},
		{
			$set: {name: 'Shawn'},
			$inc: {age: 1}
		},
		{returnOriginal: false}
	).then(console.log)

//	client.close()
})