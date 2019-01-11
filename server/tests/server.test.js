const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');
const {populateTodos, testTodos, populateUsers, testUsers} = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateTodos);
 
describe('POST /todos', () => {
	it('should create a new todo', (done) => {
		let text = 'Test todo text';
		let {token} = testUsers[0].tokens[0];
		request(app)
		.post('/todos')
		.set('x-auth', token)
		.send({text})
		.expect(200)
		.expect((res) => {
			expect(res.body.text).toBe(text)
		})
		.end((err, res) => {
			if(err) {
				return done(err)
			}

			Todo.find().then(todos => {
				expect(todos.length).toBe(3)
				expect(todos.reverse()[0].text).toBe(text)
				done()
			}).catch(err => done(err))
		});
	});
	it('should not create todo with invalid body data', (done) => {
		let test = {}
		let {token} = testUsers[0].tokens[0];
		request(app)
		.post('/todos')
		.set('x-auth', token)
		.send(test)
		.expect(400)
		.end((err, res) => {
			if(err) {
				return done(err)
			}

			Todo.find().then(todos => {
				expect(todos.length).toBe(2)
				done()
			}).catch(done)
		});
	});
});
 
describe('GET /todos', () => {
	it('should get all todos', (done) => {
		let {token} = testUsers[0].tokens[0];
		request(app)
		.get('/todos')
		.set('x-auth', token)
		.expect(200)
		.expect(res => {
			expect(res.body.todos.length).toBe(1)
		})
		.end(done);
	});
});

describe('GET /todos/:id', () => {
	it('should return todo doc', (done) => {
		let {token} = testUsers[0].tokens[0];
		request(app)
		.get(`/todos/${testTodos[0]._id.toHexString()}`)
		.set('x-auth', token)
		.expect(200)
		.expect(res => {
			expect(res.body.todo.text).toBe(testTodos[0].text)
		})
		.end(done);
	});
	it('should return 404 if todo not found', done => {
		let hexId = new ObjectID()
		let {token} = testUsers[0].tokens[0];
		request(app)
		.get(`/todos/${hexId.toHexString()}`)
		.set('x-auth', token)
		.expect(404)
		.end(done)
	});
	it('should return 404 for non ObjectIDs', done => {
		let randomID = Math.round(Math.random() * 1000)
		let {token} = testUsers[0].tokens[0];
		request(app)
		.get(`/todos/${randomID}`)
		.set('x-auth', token)
		.expect(404)
		.end(done)
	});
	it('should not return todo doc created by another user', (done) => {
		let {token} = testUsers[0].tokens[0];
		request(app)
		.get(`/todos/${testTodos[1]._id.toHexString()}`)
		.set('x-auth', token)
		.expect(404)
		.end(done);
	});
});

describe('DELETE /todos/:id', () => {
	it('should remove a todo', done => {
		let hexId = testTodos[1]._id.toHexString();
		let {token} = testUsers[1].tokens[0];
		request(app)
		.delete(`/todos/${hexId}`)
		.set('x-auth', token)
		.expect(200)
		.expect(res => {
			expect(res.body.todo._id).toBe(hexId);
		})
		.end((err, res) => {
			if(err) {
				return done(err)
			}
			Todo.findById(hexId).then(todo => {
				expect(todo).toBeNull()
				done()
			}).catch(e => done(e));
		})
	});
	it('should not remove a todo for another user', done => {
		let hexId = testTodos[0]._id.toHexString();
		let {token} = testUsers[1].tokens[0];
		request(app)
		.delete(`/todos/${hexId}`)
		.set('x-auth', token)
		.expect(404)
		.end((err, res) => {
			if(err) {
				return done(err);
			}
			Todo.findById(hexId).then(todo => {
				expect(todo).toBeDefined();
				done();
			}).catch(e => done(e));
		})
	});
	it('should return 404 if todo not found', done => {
		let hexId = new ObjectID();
		let {token} = testUsers[1].tokens[0];
		request(app)
		.delete(`/todos/${hexId.toHexString()}`)
		.set('x-auth', token)
		.expect(404)
		.end(done)
	});
	it('should return 404 if ObjectID is invalid', done => {
		let randomID = Math.round(Math.random() * 1000)
		let {token} = testUsers[1].tokens[0];
		request(app)
		.delete(`/todos/${randomID}`)
		.set('x-auth', token)
		.expect(404)
		.end(done)
	});
});

describe('PATCH /todos/:id', () => {
	it('should update the todo', done => {
		const id = testTodos[0]._id.toHexString();
		let {token} = testUsers[0].tokens[0];
		const test = {
			text: 'This text has been changed',
			completed: true
		};
		request(app)
		.patch(`/todos/${id}`)
		.set('x-auth', token)
		.send(test)
		.expect(200)
		.expect(res => {
			expect(res.body.todo.text).toBe(test.text);
			expect(res.body.todo.completed).toBe(true);
			expect(typeof res.body.todo.completedAt).toBe('number');
		})
		.end(done);

	});
	it('should clear completedAt when todo is not completed', done => {
		const id = testTodos[1]._id.toHexString();
		let {token} = testUsers[1].tokens[0];
		const test = {
			text: 'This has also been changed',
			completed: false
		}
		request(app)
		.patch(`/todos/${id}`)
		.set('x-auth', token)
		.send(test)
		.expect(200)
		.expect(res => {
			expect(res.body.todo.text).toBe(test.text);
			expect(res.body.todo.completed).toBe(false);
			expect(res.body.todo.completedAt).toBeNull();
		})
		.end(done);
	});
	it('should not update the todo for another user', done => {
		const id = testTodos[1]._id.toHexString();
		let {token} = testUsers[0].tokens[0];
		const test = {
			text: 'This text has been changed',
			completed: true
		};
		request(app)
		.patch(`/todos/${id}`)
		.set('x-auth', token)
		.send(test)
		.expect(404)
		.end((err, res) => {
			Todo.findById(id).then(todo => {
				expect(todo.text).toBe(testTodos[1].text);
				expect(todo.completed).toBe(testTodos[1].completed);
				done();
			}).catch(done);
		});

	});
});

describe('GET /users/me', () => {
	it('should return user if authenticated', done => {
		request(app)
		.get('/users/me')
		.set('x-auth', testUsers[0].tokens[0].token)
		.expect(200)
		.expect(res => {
			expect(res.body._id).toBe(testUsers[0]._id.toHexString());
			expect(res.body.email).toBe(testUsers[0].email);
		})
		.end(done);
	});
	it('should return a 401 if not authenticated', done => {
		request(app)
		.get('/users/me')
		.expect(401)
		.expect(res => {
			expect(res.body).toMatchObject({});
		})
		.end(done);
	});
});

describe('POST /users', () => {
	it('should create a user', done => {
		let email = 'example@example.com';
		let password = 'abcdefgh';
		request(app)
		.post('/users')
		.send({email, password})
		.expect(200)
		.expect(res => {
			expect(res.headers['x-auth']).toBeDefined();
			expect(res.body._id).toBeDefined();
			expect(res.body.email).toBe(email);
		}).end(err => {
			if(err) {
				return done(err);
			}
			User.findOne({email})
			.then(user => {
				expect(user).toBeDefined();
				expect(user.password).not.toBe(password);
				done();
			}).catch(done);
		});
	});
	it('shoud return validation errors if request invald', done => {
		let email = 'notAnEmail';
		let password = ['123'];
		request(app)
		.post('/users')
		.send({email, password})
		.expect(400)
		.end(done);
	});
	it('should not create user if email in use', done => {
		let email = 'eric@example.com';
		let password = 'abcdefgh';
		request(app)
		.post('/users')
		.send({email, password})
		.expect(400)
		.end(done);
	});
});

describe('POST /users/login', () => {
	it('should login user and return auth token', done => {
		let {email, password, _id} = testUsers[1];
		request(app)
		.post('/users/login')
		.send({email, password})
		.expect(200)
		.expect(res => {
			expect(res.headers['x-auth']).toBeDefined();
		})
		.end((err, res) => {
			if(err) {
				return done(err);
			}
			User.findById(_id)
			.then(user => {
				expect(user.tokens[1]).toMatchObject({
					access: 'auth',
					token: res.headers['x-auth']
				});
				done();
			}).catch(done);
		});
	});
	it('should reject invalid login', done => {
		let {email, _id} = testUsers[1];
		let password = 'NotTheCorrectPassword';
		request(app)
		.post('/users/login')
		.send({email, password})
		.expect(400)
		.expect(res => {
			expect(res.headers['x-auth']).not.toBeDefined();
		})
		.end((err, res) => {
			if(err) {
				return done(err);
			}
			User.findById(_id)
			.then(user => {
				expect(user.tokens.length).toBe(1);
				done();
			}).catch(done);
		});
	});
});
describe('DELETE /users/me/token', () => {
	it('should remove auth token on logout', done => {
		let {token} = testUsers[0].tokens[0];
		let {_id} = testUsers[0];
		request(app)
		.delete('/users/me/token')
		.set('x-auth', token)
		.expect(200)
		.end((err, res) => {
			if(err) {
				return done(err);
			}
			User.findById(_id).then(user => {
				expect(user.tokens.length).toBe(0);
				done();
			}).catch(done);
		})
	});
});