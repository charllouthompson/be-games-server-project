const { selectCategories, selectReviewById, updateReviewVotesById, selectReviews, selectReviewsQuery, selectCommentsByReview, postCommentsByReviewId, deleteCommentById, selectUsers, selectUserByUsername, patchCommentByCommentId, sendAPI } = require('../models/games-models');

exports.getCategories = (req, res, next) => {
    selectCategories()
    .then((categories) => {
        res.status(200).send({ categories })
    })
    .catch(err => next(err))
}

exports.getReviewById = (req, res, next) => {
    const { review_id } = req.params
    selectReviewById(review_id)
    .then((review, reject) => {
        res.status(200).send({ review })
    })
    .catch(err => next(err))
}

exports.patchReviewVotesById = (req, res, next) => {
  const { review_id } = req.params
  const { inc_votes } = req.body
      updateReviewVotesById(review_id, inc_votes)
      .then((review) => {
      res.status(200).send({ review })   
  }).catch(err => next(err))
}

exports.getReviews = (req, res, next) => {
  const { sort_by, order, category } = req.query
  selectReviews(sort_by, order, category)
  .then((reviews) => {
      res.status(200).send({ reviews })
  })
  .catch(err => next(err))
}

exports.getCommentsByReview = (req, res, next) => {
  const { review_id } = req.params
  selectCommentsByReview(review_id)
  .then((comments) => {
    res.status(200).send({ comments })
  })
  .catch(err => next(err))
}

exports.postCommentsByReview = (req, res, next) => {
  const { review_id } = req.params
  const { username, body } = req.body
  postCommentsByReviewId(review_id, username, body)
  .then((comment) => {
    res.status(201).send({ comment })
  })
  .catch(err => next(err))
}

exports.deleteComment = (req, res, next) => {
  const { comment_id } = req.params
  deleteCommentById(comment_id)
  .then((deleted) => {
    console.log("in delete controller response =", deleted)
    res.status(204).send({ deleted })
  })
  .catch(err => next(err))
}

exports.getAPI = (req, res, next) => {
  const contents = sendAPI()
  res.status(200).send(contents)
}

exports.getUsers = (req, res, next) => {
  selectUsers()
  .then((users) => {
    res.status(200).send({ users })
  })
  .catch(err => next(err))
}

exports.getUserByUsername = (req, res, next) => {
  const { username } = req.params
  selectUserByUsername(username)
  .then((user) => {
    res.status(200).send({ user })
  })
  .catch(err => next(err))
}

exports.patchCommentById = (req, res, next) => {
  const { comment_id } = req.params
  const { inc_votes } = req.body
  patchCommentByCommentId(comment_id, inc_votes)
  .then((comment) => {
    res.status(200).send({ comment })
  })
  .catch(err => next(err))
}

exports.getAllOthers = (req, res, next) => {
  res.status(404)
 }