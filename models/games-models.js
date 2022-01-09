const { map } = require('lodash');
const { query } = require('../db/connection');
const database = require('../db/connection');

exports.selectCategories = () => {
    return database.query('SELECT * FROM categories;')
    .then((result) => {
        return result.rows;
    })
}

exports.selectReviewById = async (review_id) => {
   if (isNaN(parseInt(review_id)) && review_id !== 0) {
        return Promise.reject({
                status: 400,
                msg: 'Review_id input must be corrected to be a number'
            })
    } else  {
        const idExists = await database.query('SELECT * FROM reviews WHERE review_id = $1', [review_id])
        if (idExists.rows.length === 0) {
        return Promise.reject({
                status: 400,
                msg: 'Review_id does not exist'
            })
    } 
    }
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
};

exports.updateReviewVotesById = async (review_id, inc_votes) => {
    if (inc_votes === undefined) {
        return database.query('SELECT * FROM reviews WHERE review_id = $1', [review_id])
        .then((response) => {
            return response.rows[0]
        })
    } else if (isNaN(parseInt(inc_votes)) && inc_votes !== 0) {
      return Promise.reject({
              status: 400,
              msg: 'Inc_votes input must be corrected to be a number'
          })
    } else if (isNaN(parseInt(review_id)) && review_id !== 0) {
       return Promise.reject({
               status: 400,
               msg: 'Review_id input must be corrected to be a number'
           })
   } else  {
       const idExists = await database.query('SELECT * FROM reviews WHERE review_id = $1', [review_id])
       if (idExists.rows.length === 0) {
        return Promise.reject({
                status: 404,
                msg: 'Review_id does not exist'
            })
    } 
    }
      return database.query(`SELECT votes FROM reviews WHERE review_id = $1`, [review_id])
      .then((result) => {
          const { votes } = result.rows[0]
          let newVotes = votes + inc_votes
          return newVotes
        })
      .then((votes) => {
          return database.query(`UPDATE reviews SET votes = $1 WHERE review_id = $2 RETURNING *`, [votes, review_id])
      })
      .then((updatedReview) => {
          return updatedReview.rows[0]
      })
};
 
exports.selectReviews = async (sort_by = "created_at", order = "desc", category = undefined) => {
    const sortBy = sort_by
    const orderBy = order
    const categoryOf = category
    let queryStr = 'SELECT review_id FROM reviews'
    if (categoryOf !== undefined) {  
        const categoryArr = await database.query('SELECT slug FROM categories').then((slugArr) => {
            return slugArr.rows.map((category) => {
                return category.slug
            })
        })
        if (!categoryArr.includes(categoryOf)) {
            return Promise.reject({
                status: 404,
                msg: 'Invalid category, must provide an existing category'
            })
        } else {
            const reviewCats = await database.query('SELECT category FROM reviews;').then((categoriesArr) => {
                return categoriesArr.rows.map((catObj) => {
                    return catObj.category
                })
            })
            if (reviewCats.includes(categoryOf)) {
                queryStr += ` LEFT JOIN categories ON reviews.category = categories.slug WHERE category='${categoryOf}'`
            } else {
                return []
            }
        }
    }
    if (orderBy !== "desc" && orderBy !== "asc") {
        return Promise.reject({
            status: 400,
            msg: "Invalid order query, must provide a ascending or descending to order"
        })
    }
    if (sortBy !== "created_at") {
        const reviewColumnsArr = ["review_id", "title", "review_body", "designer", "review_img_url", "votes", "category", "owner", "created_at"]
        if (!reviewColumnsArr.includes(sortBy)) {
            return Promise.reject({
                status: 400,
                msg: "Invalid sort_by query, must provide a parameter to sort by"
            })
        } 
    }
    queryStr += ` ORDER BY ${sortBy} ${orderBy}` 
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
        delete review[0]['review_body']
        return review[0]
    })
    }
    const response = await database.query(queryStr + ';')
    .then( async (id) => {
        return await Promise.all(id.rows.map((review) => {
            let id = review['review_id']
            return selectReviewById(id)
        }))
    })   
    return response
}

exports.selectCommentsByReview = async (review_id) => {
    if (isNaN(parseInt(review_id)) && review_id !== 0) {
         return Promise.reject({
                 status: 400,
                 msg: 'Review_id input must be corrected to be a number'
             })
     } else  {
         const idExists = await database.query('SELECT * FROM reviews WHERE review_id = $1', [review_id])
         if (idExists.rows.length === 0) {
         return Promise.reject({
                 status: 404,
                 msg: 'Review_id does not exist'
             })
        } 
    }
    return database.query(`SELECT * FROM comments WHERE review_id = ${review_id};`)
    .then((comments) => {
        return comments.rows
    })
}

exports.postCommentsByReviewId = async (review_id, username = undefined, body = undefined) => {
    if (username === undefined || body === undefined) {
        return Promise.reject({
            status: 400,
            msg: 'Incomplete username and body section, a completed comment must be provided'
        })
    } else if (isNaN(parseInt(review_id)) && review_id !== 0) {
         return Promise.reject({
                 status: 400,
                 msg: 'Review_id input must be corrected to be a number'
             })
    } else {
        const idExists = await database.query('SELECT * FROM reviews WHERE review_id = $1', [review_id])
        if (idExists.rows.length === 0) {
        return Promise.reject({
            status: 404,
            msg: 'Review_id does not exist'
            })
        } else {
            const usersArr = await database.query('SELECT username FROM users')
            const usernamesArr = usersArr.rows.map((user) => {
            return user.username
        })
        if (!usernamesArr.includes(username)) {
            return Promise.reject({
                status: 404,
                msg: 'Invalid username provided'
            })
        }
        }   
    }  
    return database.query(`
    INSERT INTO comments (review_id, author, body)
    VALUES ($1, $2, $3) RETURNING *`, [review_id, username, body])
    .then((result) => {
        return result.rows[0]
    })
}

exports.deleteCommentById = async (comment_id) => {
    if (isNaN(parseInt(comment_id)) && comment_id !== 0) {
         return Promise.reject({
                 status: 400,
                 msg: 'Comment_id input must be corrected to be a number'
             })
    } 
    const idExists = await database.query('SELECT * FROM comments WHERE comment_id = $1', [comment_id])
    if (idExists.rows.length === 0) {
        return Promise.reject({
            status: 404,
            msg: 'Comment_id does not exist'
            })
    }
    return database.query('DELETE FROM comments WHERE comment_id = $1', [comment_id])
    .then((result) => {
        return result.rows
    })
}

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

exports.selectUsers = () => {
    return database.query('SELECT * FROM users')
    .then((result) => {
       return result.rows
    })
}

exports.selectUserByUsername = (username) => {
    return database.query('SELECT * FROM users WHERE username = $1', [username])
    .then((result) => {
        return result.rows[0]
    })
}

exports.patchCommentByCommentId = (comment_id, inc_votes) => {
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
        return updatedReview.rows[0]
    })
}