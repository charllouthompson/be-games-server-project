const db = require('../db/connection.js');
const testData = require('../db/data/test-data/index.js');
const seed = require('../db/seeds/seed.js');
const request = require('supertest')
const app = require('../app')


beforeEach(() => {
  return seed(testData)
})
afterAll(() => db.end());


describe('GET /api/categories', () => {
    test('Status 200: Responds with an object with a key of "categories" which has value of an array of category objects', () => {
        return request(app)
          .get('/api/categories')
          .expect(200)
          .then(({ body }) => {
            expect(body.categories).toBeInstanceOf(Array);
            body.categories.forEach((category) => {
              expect(category).toEqual(
                expect.objectContaining({
                  slug: expect.any(String),
                  description: expect.any(String)
                })
              );
            });
          });
      })
})

describe('GET /api/reviews/:review_id', () => {
    test('Status 200: Responds with an object with a key of "review" which has value of a single review object', () => {
        return request(app)
        .get(`/api/reviews/1`)
        .expect(200)
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
            votes: 1,
            comment_count: "0"
          }
      );
      });
    }),
    test('Status 400: Responds with an error message when invalid review_id type is provided', () => {
      return request(app)
        .get(`/api/reviews/not_an_id`)
        .expect(400)
        .then((response) => {
          expect(response.text).toEqual(
            "Review_id input must be corrected to be a number"
      );
      });
    })
    test("Status 400: Responds with an error message when review_id doesn't exist", () => {
      return request(app)
        .get(`/api/reviews/0`)
        .expect(400)
        .then((response) => {
          console.log(response)
          expect(response.text).toEqual(
            "Review_id does not exist"
      );
      });
    })
})

describe('PATCH /api/reviews/:review_id', () => {
    test('Status 200: Responds with an object with a key of "review" which has value of updated review', () => {
        const newVote = {
            inc_votes: 10
        }
        return request(app)
        .patch('/api/reviews/1')
        .send(newVote)
        .expect(200)
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
    }),
    test('Status 400: Responds with an error message when invalid review_id type is provided', () => {
      const newVote = {
        inc_votes: 10
      }
      return request(app)
        .patch(`/api/reviews/not_an_id`)
        .send(newVote)
        .expect(400)
        .then((response) => {
          expect(response.text).toEqual(
            "Review_id input must be corrected to be a number"
          );
        });
    }),
    test("Status 400: Responds with an error message when invalid inc_votes type provided", () => {
      const newVote = {
        inc_votes: "hello"
    }
      return request(app)
        .patch(`/api/reviews/1`)
        .send(newVote)
        .expect(400)
        .then((response) => {
          expect(response.text).toEqual(
            "Inc_votes input must be corrected to be a number"
      );
      });
    }),
    test("Status 404: Responds with an error message when review_id doesn't exist", () => {
      const newVote = {
        inc_votes: 10
    }
      return request(app)
        .patch(`/api/reviews/0`)
        .send(newVote)
        .expect(404)
        .then((response) => {
          expect(response.text).toEqual(
            "Review_id does not exist"
      );
      });
    }),
    test("Status 200: Responds with an unchanged review corresponding to review_id when input lacks inc_votes key", () => {
      const newVote = {}
      return request(app)
        .patch(`/api/reviews/1`)
        .expect(200)
        .send(newVote)
        .then(({ body }) => {
          expect(body.review).toEqual(
            {
              title: 'Agricola',
              designer: 'Uwe Rosenberg',
              owner: 'mallionaire',
              review_img_url:
                'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png',
              review_body: 'Farmyard fun!',
              category: 'euro game',
              created_at: "2021-01-18T10:00:20.514Z",
              votes: 1,
              review_id: 1
            }
          );
      });
    })
})

describe.only('GET /api/reviews', () => {
    test('Status 200: Responds with an object with a key of "reviews" which has value of an array of review objects', () => {
        return request(app)
          .get('/api/reviews')
          .expect(200)
          .then(({ body }) => {
            expect(body.reviews).toBeInstanceOf(Array);
            body.reviews.forEach((review) => { //ADD CHECK THAT ARRAY LENGTH >0
              expect(review).toEqual(
                expect.objectContaining({
                  review_id: expect.any(Number),
                  title: expect.any(String),
                  designer: expect.any(String),
                  owner: expect.any(String),
                  review_img_url: expect.any(String),
                  category: expect.any(String),
                  created_at: expect.any(String),
                  votes: expect.any(Number),
                  comment_count: expect.any(String)
                })
              );
            });
          });
    }),
    test('Status 200: Default sort and order are "created_at" and "desc"', () => {
      return request(app)
        .get(`/api/reviews`)
        .expect(200)
        .then(({ body }) => {
          expect(body.reviews).toBeInstanceOf(Array);
          expect(body.reviews[0]).toEqual({
              review_id: 7,
              title: "Mollit elit qui incididunt veniam occaecat cupidatat",
              designer: "Avery Wunzboogerz",
              review_img_url: "https://images.pexels.com/photos/278888/pexels-photo-278888.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
              votes: 9,
              category: "social deduction",
              owner: "mallionaire",
              created_at: "2021-01-25T11:16:54.963Z",
              comment_count: "0"
            }
          )
        });
    }),
    test('Status 200: Accepts a sort_by query, which defaults to descending order', () => {
      return request(app)
        .get(`/api/reviews?sort_by=votes`)
        .expect(200)
        .then(({ body }) => {
          expect(body.reviews).toBeInstanceOf(Array);
          expect(body.reviews[0]).toEqual({
              review_id: 12,
              title: "Scythe; you're gonna need a bigger table!",
              designer: "Jamey Stegmaier",
              review_img_url: "https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg",
              votes: 100,
              category: "social deduction",
              owner: "mallionaire",
              created_at: "2021-01-22T10:37:04.839Z",
              comment_count: "0"
            }
          )
        });
    }),
    test('Status 200: Accepts an (ascending or descending) order query, which defaults to sorting by created_at', () => {
      return request(app)
        .get(`/api/reviews?order=asc`)
        .expect(200)
        .then(({ body }) => {
          expect(body.reviews).toBeInstanceOf(Array);
          expect(body.reviews[0]).toEqual({
              review_id: 13,
              title: "Settlers of Catan: Don't Settle For Less",
              designer: "Klaus Teuber",
              review_img_url: "https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg",
              votes: 16,
              category: "social deduction",
              owner: "mallionaire",
              created_at: "1970-01-10T02:08:38.400Z",
              comment_count: "0"
            }
          )
        });
    }),
    test('Status 200: Accepts a category query, which defaults to sorting by created_at and descending order', () => {
      return request(app)
        .get(`/api/reviews?category=dexterity`)
        .expect(200)
        // .then(({ body }) => {
        //   expect(body.reviews).toBeInstanceOf(Array);
        //   expect(body.reviews[0]).toEqual({
        //       //FILL THIS ONCE CATEGORY QUERY IS COMPLETED
        //     }
        //   )
        // });
    }),
    test("Status 400: Responds with an error message when invalid sort_by query is provided", () => {
      return request(app)
        .get('/api/reviews?sort_by=no_sort')
        .expect(400)
        .then((response) => {
          expect(response.text).toEqual(
            "Invalid sort_by query, must provide a parameter to sort by"
      );
      });
    }),
    test("Status 400: Responds with an error message when invalid order query is provided", () => {
      return request(app)
        .get('/api/reviews?order=no_order')
        .expect(400)
        .then((response) => {
          expect(response.text).toEqual(
            "Invalid order query, must provide a ascending or descending to order"
      );
      });
    }),
    test("Status 404: Responds with an error message when non-existent category is provided for category query", () => {
      return request(app)
        .get('/api/reviews?category=not_a_category')
        .expect(404)
        .then((response) => {
          expect(response.text).toEqual(
            'Invalid category, must provide an existing category'
      );
      });
    }),
    test("Status 200: Responds with an object with a key of 'reviews' which has value of an empty array when provided a valid category query which doesn't have any reviews", () => {
      return request(app)
        .get(`/api/reviews?category=children's games`)
        .expect(200)
        .then(({ body }) => {
          expect(body.reviews).toBeInstanceOf(Array);
          expect(body.reviews).toEqual([])
        });
    }) 
})

describe('GET /api/reviews/:review_id/comments', () => {
    test('Status 200: Responds with an object with a key of "comments" which has value of an array of comment objects which corresond to the review_id provided', () => {
        return request(app)
          .get('/api/reviews/1/comments')
          .expect(200)
          .then(({ body }) => {
            expect(body.comments).toBeInstanceOf(Array);
            body.comments.forEach((comment) => {
              expect(comment).toEqual(
                expect.objectContaining({
                  comment_id: expect.any(Number),
                  author: expect.any(String),
                  review_id: expect.any(Number),
                  votes: expect.any(Number),
                  created_at: expect.any(String),
                  body: expect.any(String)
                })
              );
            });
          });
    }),
    test('Status 400: Responds with an error message when invalid review_id type is provided', () => {
      return request(app)
        .get('/api/reviews/not_an_id/comments')
        .expect(400)
        .then((response) => {
          expect(response.text).toEqual(
            'Review_id input must be corrected to be a number'
      );
      });
    }),
    test("Status 404: Responds with an error message when review_id doesn't exist", () => {
      return request(app)
        .get('/api/reviews/0/comments')
        .expect(404)
        .then((response) => {
          expect(response.text).toEqual(
            "Review_id does not exist"
      );
      });
    }),
    test("Status 200: Responds with an object with a key of 'comments' which has value of an empty array when provided a valid review_id which doesn't have any comments", () => {
      return request(app)
        .get('/api/reviews/1/comments')
        .expect(200)
        .then(({ body }) => {
          expect(body.comments).toBeInstanceOf(Array);
          expect(body.comments).toEqual([])
        });
    }) 
})

describe('POST /api/reviews/:review_id/comments', () => {
    test('Status 201: Responds with an object with a key of "comments" which has value of the newly created comment', () => {
        const newComment = {
            username: "mallionaire",
            body: "Posted review test"
        }
        return request(app)
        .post('/api/reviews/1/comments')
        .send(newComment)
        .expect(201)
        .then(({ body }) => {
        expect(body.comment).toEqual({
            comment_id: expect.any(Number),
            author: "mallionaire",
            review_id: 1,
            votes: 0,
            created_at: expect.any(String),
            body: "Posted review test"
        });
      });
    }),
    test('Status 400: Responds with an error message when invalid review_id type is provided', () => {
      const newComment = {
        username: "mallionaire",
        body: "Posted review test"
      }
      return request(app)
        .post('/api/reviews/not_an_id/comments')
        .send(newComment)
        .expect(400)
        .then((response) => {
          expect(response.text).toEqual(
            "Review_id input must be corrected to be a number"
      );
      });
    }),
    test("Status 404: Responds with an error message when review_id doesn't exist", () => {
      const newComment = {
        username: "mallionaire",
        body: "Posted review test"
      }
      return request(app)
        .post('/api/reviews/0/comments')
        .send(newComment)
        .expect(404)
        .then((response) => {
          expect(response.text).toEqual(
            "Review_id does not exist"
      );
      });
    }),
    test("Status 400: Responds with an error message when required fields of username or body are missing, i.e. incomplete or absent comment", () => {
      const newComment = {
      }
      return request(app)
        .post('/api/reviews/1/comments')
        .send(newComment)
        .expect(400)
        .then((response) => {
          expect(response.text).toEqual(
            "Incomplete username and body section, a completed comment must be provided"
      );
      });
    }),
    test("Status 404: Responds with an error message when username provided is invalid", () => {
      const newComment = {
        username: "fakename2000",
        body: "Posted review test"
      }
      return request(app)
        .post('/api/reviews/1/comments')
        .send(newComment)
        .expect(404)
        .then((response) => {
          expect(response.text).toEqual(
            "Invalid username provided"
      );
      });
    }),
    test('Status 201: Responds with an object with a key of "comments" which has value of the newly created comment, ignoring unnecessary properties', () => {
      const newComment = {
          username: "mallionaire",
          body: "Posted review test",
          extra_prop: "Ignore me!"
      }
      return request(app)
      .post('/api/reviews/1/comments')
      .send(newComment)
      .expect(201)
      .then(({ body }) => {
      expect(body.comment).toEqual({
          comment_id: expect.any(Number),
          author: "mallionaire",
          review_id: 1,
          votes: 0,
          created_at: expect.any(String),
          body: "Posted review test"
      });
    });
  })
})

describe('DELETE /api/comments/:comment_id', () => {
    test('Status 204: Returns an empty response body to show comment has been deleted', () => {
        return request(app)
        .delete('/api/comments/1')
        .expect(204)
    }),
    test("Status 404: Responds with an error message when comment_id doesn't exist", () => {
      return request(app)
        .delete('/api/comments/0')
        .expect(404)
        .then((response) => {
          expect(response.text).toEqual(
            "Comment_id does not exist"
      );
      });
    }),
    test('Status 400: Responds with an error message when invalid comment_id type is provided', () => {
      return request(app)
        .get(`/api/comments/not_an_id`)
        .expect(400)
        .then((response) => {
          expect(response.text).toEqual(
            "Comment_id input must be corrected to be a number"
      );
      });
    })
})

describe('GET /api', () => {
  test('Status 200: Responds with an object with a keys of all the available endpoints, the values of which are a description of endpoint', () => {
      return request(app)
      .get('/api')
      .expect(200)
      .then(({ body }) => {
        expect(body.directory).toBeInstanceOf(Array);
        body.directory.forEach((endpoint) => {
          expect(endpoint).toEqual(
            expect.objectContaining({
              request: expect.any(String),
              path: expect.any(String),
              description: expect.any(String)
            })
          );
        });
    });
  })
})











describe('GET /api/users', () => {
    test('Status 200: Responds with an object with a key of "users" which has value of an array of user objects', () => {
        return request(app)
          .get('/api/users')
          .expect(200)
          .then(({ body }) => {
            expect(body.users).toBeInstanceOf(Array);
            body.users.forEach((user) => {
              expect(user).toEqual(
                expect.objectContaining({
                  username: expect.any(String),
                  avatar_url: expect.any(String),name: expect.any(String)
                })
              );
            });
          });
    })
})

describe('GET /api/users/:username', () => {
    test('Status 200: Responds with an object with a key of "user" which has value of a single user object', () => {
        const username = 'mallionaire';
        return request(app)
        .get(`/api/users/${username}`)
        .expect(200)
        .then(({ body }) => {
        expect(body.user).toEqual({
            username: 'mallionaire',
            name: 'haz',
            avatar_url:
            'https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg'
        });
      });
    })
})

describe('PATCH /api/comments/:comment_id', () => {
    test('Status 200: Responds with an object with a key of "comment" which has value of updated comment', () => {
        const comment_id = 1;
        const newVote = {
            inc_votes: 10
        }
        return request(app)
        .patch(`/api/comments/${comment_id}`)
        .send(newVote)
        .expect(200)
        .then(({ body }) => {
            expect(body.comment).toEqual({
                comment_id: 1,
                body: 'I loved this game too!',
                votes: 26,
                author: 'bainesface',
                review_id: 2,
                created_at: "2017-11-22T12:43:33.389Z"
              });
        });
    })
})