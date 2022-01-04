const { map } = require('lodash');
const { query } = require('../db/connection');
const database = require('../db/connection');

//GET /api/categories
exports.selectCategories = () => {
    console.log("In GET categories model")
    return database.query('SELECT * FROM categories;')
    .then((result) => {
        return result.rows;
    })
}

//GET /api/reviews/:review_id
exports.selectReviewById = (review_id) => {
    console.log('In GET review by ID model');
    let commentCount = 0
    return database.query(`SELECT COUNT(*) FROM comments WHERE review_id = $1`, [review_id])
    .then((result) => {
        commentCount = result.rows[0].count;
        return commentCount
    })
    .then(() => {
        return database.query(`SELECT * FROM reviews WHERE review_id = $1`, [review_id])
    })
    .then((result) => {
        //result.rows.review[comment_count] = commentCount
        return result.rows;
    })
    .then((review) => {
        review[0]['comment_count'] = commentCount
        return review[0]
    })
};

//PATCH /api/reviews/:review_id
exports.emptyRequestBody = () => {
    console.log("In empty request model")
    return {
        "message": "Empty request"
    }
}
exports.incorrectRequestBody = () => {
    console.log("In incorrect request model")
    return {
        "message": "Incorrect request"
    }
}

exports.updateReviewVotesById = (review_id, inc_votes) => {
    console.log('In patch model')
    return database.query(`SELECT votes FROM reviews WHERE review_id = $1`, [review_id])
    .then((result) => {
        const { votes } = result.rows[0]
        let newVotes = votes + inc_votes
        return newVotes})
    .then((votes) => {
        return database.query(`UPDATE reviews SET votes = $1 WHERE review_id = $2 RETURNING *`, [votes, review_id])
    })
    .then((updatedReview) => {
        return updatedReview.rows[0]
    })
};

//GET /api/reviews
exports.selectReviews = (sort_by = "created_at", order = "desc", category) => {
    console.log("In GET reviews model")
    const sortBy = sort_by
    const orderBy = order
    const categoryOf = category
    let selectReviewById = function(review_id) {
        let commentCount = 0
    return database.query(`SELECT COUNT(*) FROM comments WHERE review_id = $1`, [review_id])
    .then((result) => {
        commentCount = result.rows[0].count;
        return commentCount
    })
    .then(() => {
        return database.query(`SELECT * FROM reviews WHERE review_id = $1`, [review_id])
    })
    .then((result) => {
        return result.rows;
    })
    .then((review) => {
        review[0]['comment_count'] = commentCount
        return review[0]
    })
    }
    let queryStr = 'SELECT review_id FROM reviews'
    /*
    if (categoryOf) {
        queryStr += ` JOIN categories ON categories.slug=reviews.category WHERE category="${categoryOf}"`
    }
    */
    if (sortBy !== undefined || orderBy !== undefined) {
        queryStr += ` ORDER BY`
    }
    if (sortBy) {
        queryStr += ` ${sortBy}`
    }
    if (orderBy) {
        queryStr += ` ${orderBy}`
    }
    return database.query(queryStr + ';')
    .then( async (id) => {
        return await Promise.all(id.rows.map((review) => {
            let id = review['review_id']
            return selectReviewById(id)
        }))
    })
}

//GET /api/reviews/:review_id/comments
exports.selectCommentsByReview = (review_id) => {
    console.log("In GET comments by review model")
    return database.query(`SELECT * FROM comments WHERE review_id = ${review_id};`)
    .then((comments) => {
        return comments.rows
    })
}

//POST /api/reviews/:review_id/comments
exports.postCommentsByReviewId = (review_id, username, body) => {
    console.log("In POST comments by review model")
    return database.query(`
    INSERT INTO comments (review_id, author, body)
    VALUES ($1, $2, $3) RETURNING *`, [review_id, username, body])
    .then((result) => {
        return result.rows
    })
}

//DELETE /api/comments/:comment_id
exports.deleteCommentById = (comment_id) => {
    console.log("In DELETE comment by ID model")
    return database.query('DELETE FROM comments WHERE comment_id = $1', [comment_id])
}

//GET /api

exports.sendAPI = () => {
    const contentsArr = [
        {
            request: "GET",
            path: "/api",
            description: "Serves descriptions of all available endpoints of the API"
        },
        {
            request: "GET",
            path: "/api/categories",
            description: "Serves an array of all categories"
        },
        {
            request: "GET",
            path: "/api/reviews/:review_id",
            description: "Serves review corresponding to the review_id specified"
        },
        {
            request: "PATCH",
            path: "/api/reviews/:review_id",
            description: "Serves updated review corresponding to the review_id specified"
        },
        {
            request: "GET",
            path: "/api/reviews",
            description: "Serves an array of all reviews",
            queries: ["category", "sort_by", "order"]
        },
        {
            request: "GET",
            path: "/api/reviews/:review_id/comments",
            description: "Serves all comments corresponding to review with the review_id specified"
        },
        {
            request: "POST",
            path: "/api/reviews/:review_id/comments",
            description: "Serves the newly posted comment"
        },
        {
            request: "DELETE",
            path: "/api/comments/:comment_id",
            description: "Deletes comment corresponding to comment_id specified"
        },
        {
            request: "GET",
            path: "/api/users",
            description: "Serves an array of all users"
        },
        {
            request: "GET",
            path: "/api/users/:username",
            description: "Serves user corresponding to the username specified"
        },
        {
            request: "PATCH",
            path: "/api/comments/:comment_id",
            description: "Serves updated comment corresponding to the comment_id specified"
        }
    ]
    return { directory: contentsArr }
}

//GET /api/users
exports.selectUsers = () => {
    console.log("In GET users model")
    return database.query('SELECT username FROM users')
    .then((result) => {
       return result.rows
    })
}

//GET /api/users/:username
exports.selectUserByUsername = (username) => {
    console.log("In GET users by username model")
    return database.query('SELECT * FROM users WHERE username = $1', [username])
    .then((result) => {
        return result.rows
    })
}

//PATCH /api/comments/:comment_id
exports.patchCommentByCommentId = (comment_id, inc_votes) => {
    console.log("In PATCH users by username model")
    return database.query(`SELECT votes FROM comments WHERE comment_id = $1`, [comment_id])
    .then((result) => {
        const { votes } = result.rows[0]
        let newVotes = votes + inc_votes
        return newVotes
    })
    .then((votes) => {
        return database.query(`UPDATE comments SET votes = $1 WHERE comment_id = $2 RETURNING *`, [votes, comment_id])
    })
    .then((updatedReview) => {
        return updatedReview.rows
    })
}