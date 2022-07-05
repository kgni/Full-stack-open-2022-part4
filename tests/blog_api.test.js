const supertest = require('supertest');
const mongoose = require('mongoose');
const helper = require('./test_helper');
const app = require('../index');
const api = supertest(app);

const Blog = require('../models/blog');

beforeEach(async () => {
	await Blog.deleteMany({});

	for (let blog of helper.initialBlogs) {
		let blogObject = new Blog(blog);
		await blogObject.save();
	}
});

test('all blogs are returned', async () => {
	const response = await api.get('/api/blogs');

	expect(response.body).toHaveLength(helper.initialBlogs.length);
});

test('blogs contains id property', async () => {
	const blogsAtStart = await helper.blogsInDb();

	const blogToView = blogsAtStart[0];

	expect(blogToView.id).toBeDefined();
});

test('a valid blog can be added', async () => {
	const newBlog = {
		title: 'This is a new blog',
		author: 'kgni',
		url: 'https://www.google.com/',
		likes: 3,
	};

	await api
		.post('/api/blogs')
		.send(newBlog)
		.expect(201)
		.expect('Content-Type', /application\/json/);

	const blogsAtEnd = await helper.blogsInDb();
	expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1);

	const contents = blogsAtEnd.map((blog) => blog.title);
	expect(contents).toContain('This is a new blog');
});

test('Likes missing in POST request will default to the value 0', async () => {
	const newBlog = {
		title: 'This is a new blog',
		author: 'kgni',
		url: 'https://www.google.com/',
	};

	await api
		.post('/api/blogs')
		.send(newBlog)
		.expect(201)
		.expect('Content-Type', /application\/json/);

	const blogsAtEnd = await helper.blogsInDb();
	const lastBlog = blogsAtEnd[blogsAtEnd.length - 1];
	console.log(lastBlog);
	expect(lastBlog).toHaveProperty('likes', 0);
});

test('If title and url properties are missing in POST request, respond with status code 400', async () => {
	const newBlog = {
		author: 'kgni',
	};

	await api
		.post('/api/blogs')
		.send(newBlog)
		.expect(400)
		.expect('Content-Type', /application\/json/);
});

test('delete a blog', async () => {
	const blogsAtStart = await helper.blogsInDb();

	const blogToView = blogsAtStart[0];

	await api.delete(`/api/blogs/${blogToView.id}`).expect(204);

	const blogsAtEnd = await helper.blogsInDb();

	expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1);
});

test.only('update a blog', async () => {
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

afterAll(() => {
	mongoose.connection.close();
});
