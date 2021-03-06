const supertest = require('supertest');
const mongoose = require('mongoose');
const helper = require('./test_helper');
const app = require('../index');
const api = supertest(app);

const Blog = require('../models/blog');
const User = require('../models/user');

beforeEach(async () => {
	await Blog.deleteMany({});
	await User.deleteMany({});

	for (let blog of helper.initialBlogs) {
		let blogObject = new Blog(blog);
		await blogObject.save();
	}

	for (let user of helper.initialUsers) {
		let userObject = new User(user);
		await userObject.save();
	}
});

test('all blogs are returned', async () => {
	const res = await api.get('/api/blogs');

	expect(res.body).toHaveLength(helper.initialBlogs.length);
});

test('blogs contains id property', async () => {
	const blogsAtStart = await helper.blogsInDb();

	const blogToView = blogsAtStart[0];

	expect(blogToView.id).toBeDefined();
});

test('create user, login, add a blog', async () => {
	// create new user object
	let user = {
		username: 'username',
		password: 'password',
		name: 'admin',
	};

	// create new user hitting our users endpoint

	const newUser = await api
		.post('/api/users')
		.send(user)
		.expect(201)
		.expect('Content-Type', /application\/json/);

	// login with credentials for newly created user.

	let token = await api
		.post('/api/login')
		.send({ username: 'username', password: 'password' })
		.expect(200);

	// get the token value from when we are logging in

	token = token._body.token;

	// create new blog
	const newBlog = {
		title: 'This is a new blog',
		author: 'kgni',
		url: 'https://www.google.com/',
		likes: 3,
	};

	// hitting our blogs endpoint for creating a new blog, where we are using the token to check if authentication works.

	await api
		.post('/api/blogs')
		.set('Authorization', 'Bearer ' + token)
		.send(newBlog)
		.expect(201)
		.expect('Content-Type', /application\/json/);

	// check if blog is in db

	const blogsAtEnd = await helper.blogsInDb();
	expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1);

	// another check to see if the blog is in the db

	const contents = blogsAtEnd.map((blog) => blog.title);
	expect(contents).toContain('This is a new blog');
});

test('Likes missing in POST req will default to the value 0', async () => {
	let user = {
		username: 'username',
		password: 'password',
		name: 'admin',
	};

	// create new user hitting our users endpoint

	const newUser = await api
		.post('/api/users')
		.send(user)
		.expect(201)
		.expect('Content-Type', /application\/json/);

	// login with credentials for newly created user.

	let token = await api
		.post('/api/login')
		.send({ username: 'username', password: 'password' })
		.expect(200);

	// get the token value from when we are logging in

	token = token._body.token;
	const newBlog = {
		title: 'This is a new blog',
		author: 'kgni',
		url: 'https://www.google.com/',
	};

	await api
		.post('/api/blogs')
		.send(newBlog)
		.set('Authorization', 'Bearer ' + token)
		.expect(201)
		.expect('Content-Type', /application\/json/);

	const blogsAtEnd = await helper.blogsInDb();
	const lastBlog = blogsAtEnd[blogsAtEnd.length - 1];
	console.log(lastBlog);
	expect(lastBlog).toHaveProperty('likes', 0);
});

test.only('If title and url properties are missing in POST req, respond with status code 400', async () => {
	let user = {
		username: 'username',
		password: 'password',
		name: 'admin',
	};

	// create new user hitting our users endpoint

	const newUser = await api
		.post('/api/users')
		.send(user)
		.expect(201)
		.expect('Content-Type', /application\/json/);

	// login with credentials for newly created user.

	let token = await api
		.post('/api/login')
		.send({ username: 'username', password: 'password' })
		.expect(200);

	// get the token value from when we are logging in

	token = token._body.token;
	const newBlog = {
		author: 'kgni',
	};

	await api
		.post('/api/blogs')
		.set('Authorization', 'Bearer ' + token)
		.send(newBlog)
		.expect(400)
		.expect('Content-Type', /application\/json/);
});

test.only('delete a blog', async () => {
	let user = {
		username: 'username',
		password: 'password',
		name: 'admin',
	};

	// create new user hitting our users endpoint

	const newUser = await api
		.post('/api/users')
		.send(user)
		.expect(201)
		.expect('Content-Type', /application\/json/);

	// login with credentials for newly created user.

	let token = await api
		.post('/api/login')
		.send({ username: 'username', password: 'password' })
		.expect(200);

	// get the token value from when we are logging in

	token = token._body.token;

	const newBlog = {
		title: 'This is a new blog',
		author: 'kgni',
		url: 'https://www.google.com/',
	};

	const blogsAtStart = await helper.blogsInDb();

	await api
		.post('/api/blogs')
		.send(newBlog)
		.set('Authorization', 'Bearer ' + token)
		.expect(201)
		.expect('Content-Type', /application\/json/);

	await api
		.delete(`/api/blogs/${newBlog.id}`)
		.set('Authorization', 'Bearer ' + token)
		.expect(204);

	const blogsAtEnd = await helper.blogsInDb();

	expect(blogsAtEnd).toHaveLength(blogsAtStart.length);
});

test('update a blog', async () => {
	const blogsAtStart = await helper.blogsInDb();

	const blogToUpdate = blogsAtStart[0];

	await api
		.put(`/api/blogs/${blogToUpdate.id}`)
		.send({ likes: 10 })
		.expect(200);

	const blogsAtEnd = await helper.blogsInDb();

	const blogToReview = blogsAtEnd[0];

	expect(blogToReview).toHaveProperty('likes', 10);
	console.log(blogToReview);
});

test('all users are returned', async () => {
	const res = await api.get('/api/users');

	expect(res.body).toHaveLength(helper.initialUsers.length);
});

test('If username is missing return statuscode 400 and an error message', async () => {
	const newUser = {
		password: 'testuser',
		name: 'Mario',
	};

	await api
		.post('/api/blogs')
		.send(newUser)
		.expect(400)
		.expect('Content-Type', /application\/json/);

	const res = await api.get('/api/users');

	expect(res.body).toHaveLength(helper.initialUsers.length);
});

test('If  password is missing return statuscode 400 and an error message', async () => {
	const newUser = {
		username: 'testuser',
		name: 'Mario',
	};

	await api
		.post('/api/blogs')
		.send(newUser)
		.expect(400)
		.expect('Content-Type', /application\/json/);

	const res = await api.get('/api/users');

	expect(res.body).toHaveLength(helper.initialUsers.length);
});

test('If username does not have a length of at least 3 return statuscode 400 and an error message', async () => {
	const newUser = {
		username: 'te',
		password: '1234',
		name: 'Mario',
	};

	await api
		.post('/api/blogs')
		.send(newUser)
		.expect(400)
		.expect('Content-Type', /application\/json/);

	const res = await api.get('/api/users');

	expect(res.body).toHaveLength(helper.initialUsers.length);
});

test('If password does not have a length of at least 3 return statuscode 400 and an error message', async () => {
	const newUser = {
		username: 'testuser',
		password: '12',
		name: 'Mario',
	};

	await api
		.post('/api/blogs')
		.send(newUser)
		.expect(400)
		.expect('Content-Type', /application\/json/);

	const res = await api.get('/api/users');

	expect(res.body).toHaveLength(helper.initialUsers.length);
});

test('If username starts with kgni, return statuscode 404 and error message', async () => {
	const newUser = {
		username: 'kgni123',
		password: '12345',
		name: 'Mario',
	};

	await api
		.post('/api/blogs')
		.send(newUser)
		.expect(400)
		.expect('Content-Type', /application\/json/);

	const res = await api.get('/api/users');

	expect(res.body).toHaveLength(helper.initialUsers.length);
});

test('a valid user can be created', async () => {
	const newUser = {
		username: 'testuser',
		password: '1234',
		name: 'Preben',
	};

	await api
		.post('/api/users')
		.send(newUser)
		.expect(201)
		.expect('Content-Type', /application\/json/);

	const usersAtEnd = await helper.usersInDb();
	expect(usersAtEnd).toHaveLength(helper.initialUsers.length + 1);

	const contents = usersAtEnd.map((user) => user.username);
	expect(contents).toContain('testuser');
});

afterAll(() => {
	mongoose.connection.close();
});
