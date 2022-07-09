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

const initialUsers = [
	{
		username: 'kgni',
		name: 'Karl',
	},
	{
		username: 'preben',
		name: 'Prebsi',
	},
];

const usersInDb = async () => {
	const users = await User.find({});
	return users.map((user) => user.toJSON());
};

module.exports = {
	initialBlogs,
	blogsInDb,
	initialUsers,
	usersInDb,
};
