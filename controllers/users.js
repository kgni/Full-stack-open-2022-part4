const bcrypt = require('bcrypt');
const { Router } = require('express');
const usersRouter = require('express').Router();
const User = require('../models/user');

usersRouter.get('/', async (req, res) => {
	const users = await User.find({}).populate('blogs', {
		title: 1,
		author: 1,
		url: 1,
	});

	if (users.length === 0) {
		res.status(404).json({ error: 'No users found' });
	}

	res.json(users);
});

usersRouter.post('/', async (req, res) => {
	const { username, name, password } = req.body;

	const existingUser = await User.findOne({ username });

	// If username or password is not inputted, return error (if username/password is true, then it negates to false which means the if statement won't run)
	if (!username || !password) {
		return res.status(400).json({
			error: 'please provide both username and password',
		});
	}

	// check if username is at least 3 chars long
	if (username.length < 3) {
		return res.status(400).json({
			error: 'username must be at least 3 characters',
		});
	}
	// check if password is at least 3 chars long
	if (password.length < 3) {
		return res.status(400).json({
			error: 'password must be at least 3 characters',
		});
	}
	// check if username already exists (must be unique)
	if (existingUser) {
		return res.status(400).json({
			error: 'username must be unique',
		});
	}

	// check if username starts with kgni
	if (username.toLowerCase().startsWith('kgn')) {
		return res.status(400).json({
			error: 'username cannot start with kgn',
		});
	}

	// check if username starts with 'kgni', if it does don't allow a user to be created

	// if (password.length < 6) {
	//   return res.status(400).json({
	// 		error: 'password most be longer than 6 characters',
	// 	});
	// }

	const saltRounds = 10;
	const passwordHash = await bcrypt.hash(password, saltRounds);

	const user = new User({
		username,
		name,
		passwordHash,
	});

	const savedUser = await user.save();

	res.status(201).json(savedUser);
});

module.exports = usersRouter;
