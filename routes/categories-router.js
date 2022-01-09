const { getCategories } = require('../controllers/games-controllers');
const categoriesRouter = require('express').Router();

categoriesRouter.get('/', getCategories)

module.exports = categoriesRouter;

