const apiRouter = require('express').Router();
const categoriesRouter = require('./categories-router');
const commentsRouter = require('./comments-router');
const reviewsRouter = require('./reviews-router');
const usersRouter = require('./users-router');
const { getAPI } = require('../controllers/games-controllers')

apiRouter.get('/', getAPI)
apiRouter.use('/categories', categoriesRouter)
apiRouter.use('/comments', commentsRouter)
apiRouter.use('/reviews', reviewsRouter)
apiRouter.use('/users', usersRouter)

module.exports = apiRouter;