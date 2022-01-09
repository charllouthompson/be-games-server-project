const { getReviews, getReviewById, patchReviewVotesById, getCommentsByReview, postCommentsByReview } = require('../controllers/games-controllers');
const reviewsRouter = require('express').Router();

reviewsRouter.get('/', getReviews)

reviewsRouter.route('/:review_id')
.get(getReviewById)
.patch(patchReviewVotesById)

reviewsRouter.route('/:review_id/comments')
.get(getCommentsByReview)
.post(postCommentsByReview)

module.exports = reviewsRouter;


