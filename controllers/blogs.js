const jwt = require('jsonwebtoken');
const { response } = require('..');
const blogsRouter = require('express').Router();
const Blog = require('../models/blog');
const User = require('../models/user');

const getTokenFrom = (req) => {
	const authorization = req.get('authorization');
	if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
		return authorization.substring(7);
	}
	return null;
};

blogsRouter.get('/', async (req, res) => {
	const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 });
	res.json(blogs);
});

blogsRouter.post('/', async (req, res) => {
	const body = req.body;

	const token = getTokenFrom(req);
	const decodedToken = jwt.verify(token, process.env.SECRET);
	if (!decodedToken.id) {
		return response.status(401).json({ error: 'token missing or invalid' });
	}

	const user = await User.findById(decodedToken.id);

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

	const token = getTokenFrom(req);
	const decodedToken = jwt.verify(token, process.env.SECRET);
	if (!decodedToken.id) {
		return response.status(401).json({ error: 'token missing or invalid' });
	}

	const userId = decodedToken.id.toString();
	const blog = await Blog.findById(id);

	if (userId === blog.user.toString()) {
		await Blog.findByIdAndDelete(id);
	} else {
		return response
			.status(401)
			.json({ error: 'Auth error, user does not own this post' });
	}
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
