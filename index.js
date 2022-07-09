const config = require('./utils/config');
const express = require('express');
require('express-async-errors');
const app = express();
const cors = require('cors');
const logger = require('./utils/logger');
const blogsRouter = require('./controllers/blogs');
const usersRouter = require('./controllers/users');
const middleware = require('./utils/middleware');
const mongoose = require('mongoose');

const connectDB = async () => {
	await mongoose.connect(config.MONGO_URI);
	logger.info('Connected to DB');
	await app.listen(config.PORT, () => {
		logger.info(`Listening on port ${config.PORT}`);
	});
};
connectDB();

app.use(cors());
app.use(express.json());

app.use('/api/blogs', blogsRouter);
app.use('/api/users', usersRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
