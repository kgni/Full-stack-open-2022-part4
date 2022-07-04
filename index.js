const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const config = require('./utils/config');
const logger = require('./utils/logger');
const blogsRouter = require('./controllers/blogs');

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
