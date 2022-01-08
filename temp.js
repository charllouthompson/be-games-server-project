



const idExists = await database.query('SELECT * FROM reviews WHERE review_id = $1', [review_id])
if (idExists.rows.length === 0) {
    console.log("in ID not exist")
return Promise.reject({
        status: 404,
        msg: 'Review_id does not exist'
    })
} else if (isNaN(parseInt(review_id)) && review_id !== 0) {
    console.log("in nan")
     return Promise.reject({
             status: 400,
             msg: 'Review_id input must be corrected to be a number'
         })
 } else if (!checkVotes.hasOwnProperty('inc_votes')) {
    return database.query('SELECT * FROM reviews WHERE review_id')
    .then((response) => {
        console.log(response)
    })
} else if (isNaN(parseInt(inc_votes)) && inc_votes !== 0) {
    console.log("in no VOTES")
    return Promise.reject({
            status: 400,
            msg: 'Inc_votes input must be corrected to be a number'
        })
  } 