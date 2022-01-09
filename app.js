const dotenv = require('dotenv')
dotenv.config({path: `.env.${process.env.NODE_ENV}`})
const express = require('express');
const apiRouter = require('./routes/api-router')
const { getAllOthers } = require('./controllers/games-controllers');
const {
  handleCustomErrors,
  handlePsqlErrors,
  handleServerErrors,
} = require('./error/index.js');

const app = express();

app.use(express.json())

app.use('/api', apiRouter)
app.get('*', getAllOthers)
app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handleServerErrors);

module.exports = app;