const jwt = require('jsonwebtoken');
const logger = require('./logger');

const reqLogger = (req, res, next) => {
	logger.info('Method:', req.method);
	logger.info('Path:  ', req.path);
	logger.info('Body:  ', req.body);
	logger.info('---');
	next();
};

const unknownEndpoint = (req, res) => {
	res.status(404).send({ error: 'unknown endpoint' });
};

const tokenExtractor = (req, res, next) => {
	const authorization = req.get('authorization');

	if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
		req.token = authorization.substring(7);
	} else {
		return null;
	}
	next();
};

const userExtractor = (req, res, next) => {
	const decodedToken = jwt.verify(req.token, process.env.SECRET);
	if (!decodedToken.id) {
		return res.status(401).json({ error: 'token missing or invalid' });
	}
	req.user = decodedToken.id.toString();
	next();
};

const errorHandler = (error, req, res, next) => {
	logger.error(error.message);

	if (error.name === 'CastError') {
		return res.status(400).send({ error: 'malformatted id' });
	} else if (error.name === 'ValidationError') {
		return res.status(400).json({ error: error.message });
	} else if (error.name === 'JsonWebTokenError') {
		return res.status(401).json({
			error: 'invalid token',
		});
	}

	next(error);
};

module.exports = {
	reqLogger,
	unknownEndpoint,
	errorHandler,
	tokenExtractor,
	userExtractor,
};
