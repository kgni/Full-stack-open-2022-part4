const Blog = require('../models/blog');

const initialBlogs = [
	{
		title: 'HTML is easy',
		author: 'kgni',
		url: 'https://www.google.com/',
		likes: 1,
	},
	{
		title: 'Another blog post',
		author: 'kgni',
		url: 'https://www.google.com/',
		likes: 2,
	},
];

const blogsInDb = async () => {
	const blogs = await Blog.find({});
	return blogs.map((blog) => blog.toJSON());
};

module.exports = {
	initialBlogs,
	blogsInDb,
};
