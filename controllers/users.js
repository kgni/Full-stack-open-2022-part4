const bcrypt = require('bcrypt');
const { Router } = require('express');
const usersRouter = require('express').Router();
const User = require('../models/user');

usersRouter.get('/', async (request, response) => {
	const users = await User.find({});

	if (users.length === 0) {
		response.status(404).json({ error: 'No users found' });
	}

	response.json(users);
});

usersRouter.post('/', async (request, response) => {
	const { username, name, password } = request.body;

	const existingUser = await User.findOne({ username });

	// If username && password exists, then we run a bunch of validators. If either username or password is missing, then we run the else statement
	if (username && password) {
		// check if username is at least 3 chars long
		if (username.length < 3) {
			return response.status(400).json({
				error: 'username must be at least 3 characters',
			});
		}
		// check if password is at least 3 chars long
		if (password.length < 3) {
			return response.status(400).json({
				error: 'password must be at least 3 characters',
			});
		}
		// check if username already exists (must be unique)
		if (existingUser) {
			return response.status(400).json({
				error: 'username must be unique',
			});
		}

		// check if username starts with kgni
		if (username.toLowerCase().startsWith('kgn')) {
			return response.status(400).json({
				error: 'username cannot start with kgn',
			});
		}
	} else {
		return response.status(400).json({
			error: 'please provide both username and password',
		});
	}

	// check if username starts with 'kgni', if it does don't allow a user to be created

	// if (password.length < 6) {
	//   return response.status(400).json({
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

	response.status(201).json(savedUser);
});

module.exports = usersRouter;
