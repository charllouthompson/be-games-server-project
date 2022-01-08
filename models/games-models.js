const { map } = require('lodash');
const { query } = require('../db/connection');
const database = require('../db/connection');


//GET /api/categories
exports.selectCategories = () => {
   // console.log("In GET categories model")
    return database.query('SELECT * FROM categories;')
    .then((result) => {
        return result.rows;
    })
}

//GET /api/reviews/:review_id
exports.selectReviewById = async (review_id) => {
    
   if (isNaN(parseInt(review_id)) && review_id !== 0) {
       console.log("in nan")
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

//PATCH /api/reviews/:review_id
exports.updateReviewVotesById = async (review_id, inc_votes) => {
    //  console.log('In patch model')
    console.log("inc votes", inc_votes)
    console.log("review_id", review_id)

    if (inc_votes === undefined) {
        return database.query('SELECT * FROM reviews WHERE review_id = $1', [review_id])
        .then((response) => {
            return response.rows[0]
        })
    } else if (isNaN(parseInt(inc_votes)) && inc_votes !== 0) {
      console.log("in no VOTES")
      return Promise.reject({
              status: 400,
              msg: 'Inc_votes input must be corrected to be a number'
          })
    } else if (isNaN(parseInt(review_id)) && review_id !== 0) {
      console.log("in nan")
       return Promise.reject({
               status: 400,
               msg: 'Review_id input must be corrected to be a number'
           })
   } else  {
       const idExists = await database.query('SELECT * FROM reviews WHERE review_id = $1', [review_id])
       if (idExists.rows.length === 0) {
           console.log("in ID not exist")
       return Promise.reject({
               status: 404,
               msg: 'Review_id does not exist'
           })
   } 
  }
  console.log("gets queried", typeof inc_votes)
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
exports.selectReviews = (sort_by = "created_at", order = "desc", category = undefined) => {
    console.log("In GET reviews model")
    const sortBy = sort_by
     const orderBy = order
     const categoryOf = category
 console.log(sortBy)
 console.log(orderBy)
 console.log(categoryOf)
 
     if (orderBy !== "desc" && orderBy !== "asc") {
         console.log("bad order")
         return Promise.reject({
             status: 400,
             msg: "Invalid order query, must provide a ascending or descending to order"
         })
     } else if (sort_by !== "created_at") {
         console.log("in sort err")
         const reviewColumnsArr = ["review_id", "title", "review_body", "designer", "review_img_url", "votes", "category", "owner", "created_at"]
         if (!reviewColumnsArr.includes(sortBy)) {
             console.log("sort by reject")
         return Promise.reject({
                 status: 400,
                 msg: "Invalid sort_by query, must provide a parameter to sort by"
             })
     } 
     } else if (categoryOf !== undefined) {      
         console.log("slugs")
         return database.query('SELECT slug FROM categories')
         .then((slugArr) => {
             return slugArr.rows.map((category) => {
                 return category.slug
             })
         }).then((categoryArr) => {
             console.log(categoryArr)
             if (!categoryArr.includes(categoryOf)) {
                 return Promise.reject({
                     status: 404,
                     msg: 'Invalid category, must provide an existing category'
                 })
             }
         })
     }
     let selectReviewById = function(review_id) {
        console.log("in async2")
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
        console.log("in async3")
        review[0]['comment_count'] = commentCount
        delete review[0]['review_body']
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
        console.log("in async1")
        return await Promise.all(id.rows.map((review) => {
            let id = review['review_id']
            return selectReviewById(id)
        }))
    })   

}













//GET /api/reviews/:review_id/comments
exports.selectCommentsByReview = async (review_id) => {
    if (isNaN(parseInt(review_id)) && review_id !== 0) {
        console.log("in nan")
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
    //console.log("In GET comments by review model")
    return database.query(`SELECT * FROM comments WHERE review_id = ${review_id};`)
    .then((comments) => {
        return comments.rows
    })
}

//POST /api/reviews/:review_id/comments
exports.postCommentsByReviewId = async (review_id, username = undefined, body = undefined) => {

    if (username === undefined || body === undefined) {
        return Promise.reject({
            status: 400,
            msg: 'Incomplete username and body section, a completed comment must be provided'
        })
    } else if (isNaN(parseInt(review_id)) && review_id !== 0) {
        console.log("in nan")
         return Promise.reject({
                 status: 400,
                 msg: 'Review_id input must be corrected to be a number'
             })
    } else {
            const idExists = await database.query('SELECT * FROM reviews WHERE review_id = $1', [review_id])
            console.log("id exists", idExists.rows)
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
                console.log(usernamesArr)
                if (!usernamesArr.includes(username)) {
                    return Promise.reject({
                        status: 404,
                        msg: 'Invalid username provided'
                    })
                }
         }   
         }  
        
   // console.log("In POST comments by review model")
    return database.query(`
    INSERT INTO comments (review_id, author, body)
    VALUES ($1, $2, $3) RETURNING *`, [review_id, username, body])
    .then((result) => {
        return result.rows[0]
    })

}

//DELETE /api/comments/:comment_id
exports.deleteCommentById = async (comment_id) => {
    console.log(comment_id)
    if (isNaN(parseInt(comment_id)) && comment_id !== 0) {
        console.log("in NAN")
         return Promise.reject({
                 status: 400,
                 msg: 'Comment_id input must be corrected to be a number'
             })
    } else {
        const idExists = await database.query('SELECT * FROM comments WHERE comment_id = $1', [comment_id])
        if (idExists.rows.length === 0) {
        return Promise.reject({
                status: 404,
                msg: 'Comment_id does not exist'
            })
        }
    }
    return database.query('DELETE FROM comments WHERE comment_id = $1', [comment_id])
    .then((result) => {
        return result.rows
    })
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
   // console.log("In GET users model")
    return database.query('SELECT * FROM users')
    .then((result) => {
       return result.rows
    })
}

//GET /api/users/:username
exports.selectUserByUsername = (username) => {
   // console.log("In GET users by username model")
    return database.query('SELECT * FROM users WHERE username = $1', [username])
    .then((result) => {
        return result.rows[0]
    })
}

//PATCH /api/comments/:comment_id
exports.patchCommentByCommentId = (comment_id, inc_votes) => {
   // console.log("In PATCH users by username model")
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