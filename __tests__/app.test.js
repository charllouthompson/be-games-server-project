const db = require('../db/connection.js');
const testData = require('../db/data/test-data/index.js');
const seed = require('../db/seeds/seed.js');
const request = require('supertest')
const app = require('../app')


beforeEach(() => {
  seed(testData)
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
    test('Status 200: Responds with an object with a key of "review" which has value of a single category object', () => {
        const review_id = 1;
        return request(app)
        .get(`/api/reviews/${review_id}`)
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
            created_at: new Date(1610964020514),
            votes: 1
        });
      });
    })
})

describe('PATCH /api/reviews/:review_id', () => {
    test('Status 200: Responds with an object with a key of "review" which has value of updated review', () => {
        const review_id = 1;
        const newVote = {
            inc_votes: 10
        }
        return request(app)
        .patch(`/api/reviews/${review_id}`)
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
                created_at: new Date(1610964020514),
                votes: 11
              });
        });
    })
})

describe('GET /api/reviews', () => {
    test('Status 200: Responds with an object with a key of "reviews" which has value of an array of review objects', () => {
        return request(app)
          .get('/api/reviews')
          .expect(200)
          .then(({ body }) => {
            expect(body.reviews).toBeInstanceOf(Array);
            body.reviews.forEach((review) => {
              expect(review).toEqual(
                expect.objectContaining({
                  review_id: expect.any(Number),
                  title: expect.any(String),
                  designer: expect.any(String),
                  owner: expect.any(String),
                  review_img_url: expect.any(String),
                  review_body: expect.any(String),
                  category: expect.any(String),
                //   created_at: new Date(1610964020514),
                  votes: expect.any(Number),
                  comment_count: expect.any(Number)
                })
              );
            });
          });
    })
})

describe('GET /api/reviews/:review_id/comments', () => {
    test('Status 200: Responds with an object with a key of "comments" which has value of an array of comment objects', () => {
        const review_id = 1;
        return request(app)
          .get(`/api/reviews/${review_id}/comments`)
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
                //   created_at: "timestamp",
                  body: expect.any(String)
                })
              );
            });
          });
    })
})

describe('POST /api/reviews/:review_id/comments', () => {
    test('Status 201: Responds with an object with a key of "comments" which has value of an array of comment objects', () => {
        const review_id = 1;
        const newComment = {
            username: "mallionaire",
            body: "Posted review test"
        }
        return request(app)
        .post(`/api/reviews/${review_id}/comments`)
        .send(newComment)
        .expect(201)
        .then(({ body }) => {
        expect(body.comment).toEqual({
            comment_id: expect.any(Number),
            author: "mallionaire",
            review_id: 1,
            votes: 0,
          //   created_at: "timestamp",
            body: "Posted review test"
        });
      });
    })
})

describe('DELETE /api/comments/:comment_id', () => {
    test('Status 204: Returns an empty response body', () => {
        const comment_id = 1
        return request(app).delete(`/api/comments/${comment_id}`).expect(204);
    })
})


//GET API

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
                created_at: new Date(1511354613389)
              });
        });
    })
})