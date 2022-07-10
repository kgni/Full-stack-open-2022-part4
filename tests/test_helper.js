const Blog = require('../models/blog');
const User = require('../models/user');

const initialBlogs = [
	{
		title: 'HTML is easy',
		author: 'kgni',
		url: 'https://www.google.com/',
		likes: 1,
		user: '62c9954caa4fe80673911d0b',
	},
	{
		title: 'Another blog post',
		author: 'kgni',
		url: 'https://www.google.com/',
		likes: 2,
		user: '62c9954caa4fe80673911d0b',
	},
];

const blogsInDb = async () => {
	const blogs = await Blog.find({});
	return blogs.map((blog) => blog.toJSON());
};

const initialUsers = [
	{
		username: 'kgni',
		passwordHash: 'password',
		name: 'Karl',
		blogs: [],
	},
	{
		username: 'admin',
		password: 'password',
		name: 'Prebsi',
		blogs: [],
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
