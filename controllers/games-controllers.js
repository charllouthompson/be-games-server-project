const { selectCategories, selectReviewById, emptyRequestBody, incorrectRequestBody, updateReviewVotesById, selectReviews, selectReviewsQuery, selectCommentsByReview, postCommentsByReviewId, deleteCommentById, selectUsers, selectUserByUsername, patchCommentByCommentId, sendAPI } = require('../models/games-models');

//GET /api/categories
exports.getCategories = (req, res, next) => {
    //console.log("In GET categories controller")
    selectCategories()
    .then((categories) => {
        res.status(200).send({ categories })
    })
    .catch(err => next(err))
}

//GET /api/reviews/:review_id
exports.getReviewById = (req, res, next) => {
    //console.log('In GET review by ID controller');
    const { review_id } = req.params
    selectReviewById(review_id)
    .then((review, reject) => {
      console.log(reject)
      console.log(review)
        res.status(200).send({ review })
    })
    .catch(err => next(err))
}

//PATCH /api/reviews/:review_id
exports.patchReviewVotesById = (req, res, next) => {
    const { review_id } = req.params
    const { inc_votes } = req.body
    console.log("inc votes = ", inc_votes)

    if(inc_votes === undefined) {
      updateReviewVotesById(review_id, 0)
      .then((review) => {
      res.status(200).send({ review })   
      }).catch(err => next(err))
    } /*else if (!inc_votes) {
      console.log('Empty request body')
      const { message } = emptyRequestBody()
      res.status(400).send({ message })
    }*
      else if (typeof inc_votes !== 'number') {
        //console.log("Incorrect request body")
        const { message } = incorrectRequestBody()
        res.status(400).send({ message })
      } else */{
        //console.log('Has request body')
        updateReviewVotesById(review_id, inc_votes)
        .then((review) => {
        res.status(200).send({ review })   
  }).catch(err => next(err))
}
}

//GET /api/reviews
exports.getReviews = (req, res, next) => {
  //console.log(req.query)
  const { sort_by, order, category } = req.query
  // console.log(sort_by)
  // console.log(order)
  // console.log(category)
  // console.log("In GET reviews controller")
  selectReviews(sort_by, order, category)
  .then((reviews) => {
      res.status(200).send({ reviews })
  })
  .catch(err => next(err))
}

/*
- `sort_by`, which sorts the reviews by any valid column (defaults to date)
- `order`, which can be set to `asc` or `desc` for ascending or descending (defaults to descending)
- `category`, which filters the reviews by the category value specified in the query
*/

//GET /api/reviews/:review_id/comments
exports.getCommentsByReview = (req, res, next) => {
  //console.log("In GET comments by review controller")
  const { review_id } = req.params
  selectCommentsByReview(review_id)
  .then((comments) => {
    res.status(200).send({ comments })
  })
  .catch(err => next(err))
}

//POST /api/reviews/:review_id/comments
exports.postCommentsByReview = (req, res, next) => {
  //console.log("In POST comments by review controller")
  const { review_id } = req.params
  const { username, body } = req.body
  postCommentsByReviewId(review_id, username, body)
  .then((comment) => {
    res.status(201).send({ comment })
  })
  .catch(err => next(err))
}

//DELETE /api/comments/:comment_id
exports.deleteComment = (req, res, next) => {
  //console.log("In DELETE comment by ID controller")
  const { comment_id } = req.params
  deleteCommentById(comment_id)
  .then(() => {
    res.status(204).send({})
  })
  .catch(err => next(err))
}

//GET /api

exports.getAPI = (req, res, next) => {
  const contents = sendAPI()
  res.status(200).send(contents)
}

//GET /api/users
exports.getUsers = (req, res, next) => {
  //console.log("In GET users controller")
  selectUsers()
  .then((users) => {
    res.status(200).send({ users })
  })
  .catch(err => next(err))
}

//GET /api/users/:username
exports.getUserByUsername = (req, res, next) => {
  //console.log("In GET users by username controller")
  const { username } = req.params
  selectUserByUsername(username)
  .then((user) => {
    res.status(200).send({ user })
  })
  .catch(err => next(err))
}

//PATCH /api/comments/:comment_id
exports.patchCommentById = (req, res, next) => {
 // console.log("In PATCH users by username controller")
  const { comment_id } = req.params
  const { inc_votes } = req.body
  if (!inc_votes) {
    //console.log('Empty request body')
    const { message } = emptyRequestBody()
    res.status(400).send({ message })
  } else if (typeof inc_votes !== 'number') {
    //console.log("Incorrect request body")
    const { message } = incorrectRequestBody()
    res.status(400).send({ message })
  } else {
    //console.log('Has request body')
    patchCommentByCommentId(comment_id, inc_votes)
    .then((comment) => {
    res.status(200).send({ comment })
  }).catch(err => next(err))
}
}

//GET *
exports.getAllOthers = (req, res, next) => {
  res.status(404).catch(err => next(err))
 }