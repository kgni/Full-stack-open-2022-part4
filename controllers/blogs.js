const blogsRouter = require('express').Router();
const Blog = require('../models/blog');
const User = require('../models/user');

blogsRouter.get('/', async (req, res) => {
	const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 });
	res.json(blogs);
});

blogsRouter.post('/', async (req, res) => {
	const body = req.body;

	const user = await User.findOne({});

	const blog = new Blog({
		title: body.title,
		author: body.author,
		url: body.url,
		likes: 0,
		user: user.id,
	});

	const savedBlog = await blog.save();

	user.blogs = user.blogs.concat(savedBlog.id);
	await user.save();
	res.status(201).json(savedBlog);
});

blogsRouter.delete('/:id', async (req, res) => {
	const { id } = req.params;

	await Blog.findByIdAndDelete(id);
	res.status(204).end();
});

blogsRouter.put('/:id', async (req, res) => {
	const { id } = req.params;
	const body = req.body;

	const blog = {
		title: body.title,
		author: body.author,
		url: body.url,
		likes: body.likes,
	};

	const updatedBlog = await Blog.findByIdAndUpdate(id, blog, { new: true });
	res.json(updatedBlog);
});

module.exports = blogsRouter;
