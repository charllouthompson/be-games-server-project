// test("Status 400: Responds with an error message when review_id doesn't exist", () => {
//     return request(app)
//       .get(`/api/reviews/0`)
//       .expect(400)
      .then((response) => {
        expect(response.text).toEqual(
          "Review_id does not exist"
    );
    });
//   })

//   test('Status 200: Responds with an object with a key of "review" which has value of updated review', () => {
//     const newVote = {
//         inc_votes: 10
//     }
//     return request(app)
//     .patch('/api/reviews/1')
//     .send(newVote)
//     .expect(200)
    .then(({ body }) => {
        expect(body.review).toEqual({
            review_id: 1,
            title: 'Agricola',
            designer: 'Uwe Rosenberg',
            owner: 'mallionaire',
            review_img_url:
              'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png',
            review_body: 'Farmyard fun!',
            category: 'euro game',
            created_at: "2021-01-18T10:00:20.514Z",
            votes: 11
          });
    });
// }),
// test('Status 400: Responds with an error message when invalid review_id type is provided', () => {
//   const newVote = {
//     inc_votes: 10
//   }
//   return request(app)
//     .patch(`/api/reviews/not_an_id`)
//     .send(newVote)
//     .expect(400)
// }),






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
                return database.query('SELECT username FROM users')
                .then((userArr) => {
                    return userArr.map((user) => {
                        return user.username
                    })
                })
                .then((usernameArr) => {
                    if (!usernameArr.includes(username)) {
                        return Promise.reject({
                            status: 404,
                            msg: 'Invalid username provided'
                        })
                    }
                })
            }
    }  
