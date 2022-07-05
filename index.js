const config = require('./utils/config');
const express = require('express');
require('express-async-errors');
const app = express();
const cors = require('cors');
const logger = require('./utils/logger');
const blogsRouter = require('./controllers/blogs');
const middleware = require('./utils/middleware');
const mongoose = require('mongoose');

mongoose
	.connect(config.MONGO_URI)
	.then(() => {
		logger.info('Connected to DB');
		app.listen(config.PORT, () => {
			logger.info(`Listening on port ${config.PORT}`);
		});
	})
	.catch((error) => logger.error('error connecting to MongoDB', error.message));

app.use(cors());
app.use(express.json());

app.use('/api/blogs', blogsRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
