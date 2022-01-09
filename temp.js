const { database } = require("faker")
// SELECT review_id FROM reviews WHERE reviews.category = "dexterity" LEFT JOIN categories ON reviews.category = categories.slug ORDER BY created_at desc;

exports.selectReviews = async (sort_by = "created_at", order = "desc", category = undefined) => {
    console.log("In GET reviews model")
    const sortBy = sort_by
     const orderBy = order
     const categoryOf = category

     let queryStr = 'SELECT review_id FROM reviews'
     console.log(queryStr)

     if (categoryOf !== undefined) {  
        console.log("slugs")
        const categoryArr = await database.query('SELECT slug FROM categories').then((slugArr) => {
            return slugArr.rows.map((category) => {
                return category.slug
            })
        })
        if (!categoryArr.includes(categoryOf)) {
            console.log("reject")
            return Promise.reject({
                status: 404,
                msg: 'Invalid category, must provide an existing category'
            })
        } else {
            queryStr += ` WHERE category="${categoryOf}"`
            console.log(queryStr)
        }
    }

    if (orderBy !== "desc" && orderBy !== "asc") {
        console.log("bad order")
        return Promise.reject({
            status: 400,
            msg: "Invalid order query, must provide a ascending or descending to order"
        })
    }
    
    if (sort_by !== "created_at") {
        console.log("in sort err")
        const reviewColumnsArr = ["review_id", "title", "review_body", "designer", "review_img_url", "votes", "category", "owner", "created_at"]
        if (!reviewColumnsArr.includes(sortBy)) {
            console.log("sort by reject")
        return Promise.reject({
            status: 400,
            msg: "Invalid sort_by query, must provide a parameter to sort by"
        })
    } 
    }
     
    queryStr += ` ORDER BY ${sortBy} ${orderBy}` 
    console.log(queryStr)
    console.log("after ifs")

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

    return database.query(queryStr + ';')
    .then( async (id) => {
        console.log("in async1")
        return await Promise.all(id.rows.map((review) => {
            let id = review['review_id']
            return selectReviewById(id)
        }))
    })   

}