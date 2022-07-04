const blogsRouter = require('express').Router();
const Blog = require('../models/blog');

blogsRouter.get('/', (req, res) => {
	Blog.find({}).then((blogs) => {
		res.json(blogs);
	});
});

blogsRouter.post('/', (req, res) => {
	const blog = new Blog(req.body);

	blog
		.save()
		.then((result) => {
			res.status(201).json(result);
		})
		.catch((error) => res.status(400).json({ error: error.message }));
});

module.exports = blogsRouter;
