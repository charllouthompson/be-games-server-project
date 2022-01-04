const dotenv = require('dotenv')
dotenv.config({path: `.env.${process.env.NODE_ENV}`})
const express = require('express');

const { getCategories, getReviewById, patchReviewVotesById, getReviews, getCommentsByReview, postCommentsByReview, deleteComment, getAPI, getUsers, getUserByUsername, patchCommentById, getAllOthers } = require('./controllers/games-controllers');

const {
  handleCustomErrors,
  handlePsqlErrors,
  handleServerErrors,
} = require('./error/index.js');

const app = express();

app.use(express.json())

app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handleServerErrors);

app.get('/api/categories', getCategories);
app.get('/api/reviews/:review_id', getReviewById);
app.patch('/api/reviews/:review_id', patchReviewVotesById);
app.get('/api/reviews', getReviews)
app.get('/api/reviews/:review_id/comments', getCommentsByReview)
app.post('/api/reviews/:review_id/comments', postCommentsByReview)
app.delete('/api/comments/:comment_id', deleteComment)
app.get('/api', getAPI)
app.get('/api/users', getUsers)
app.get('/api/users/:username', getUserByUsername)
app.patch('/api/comments/:comment_id', patchCommentById)
app.get('*', getAllOthers)


module.exports = app;