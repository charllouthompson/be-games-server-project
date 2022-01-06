const db = require('../connection');
const format = require('pg-format');

const seed = ({ categoryData, commentData, reviewData, userData }) => {
  return db
    .query(`DROP TABLE IF EXISTS comments;`)
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS reviews;`)
    })
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS users;`)
    })
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS categories;`)
    })
    .then(() => {
      // console.log("All tables dropped!")
      return db.query(`
      CREATE TABLE categories (
        slug VARCHAR(50) UNIQUE PRIMARY KEY NOT NULL,
        description VARCHAR(500)
      );
      `)
    })
    .then(() => {
      return db.query(`
      CREATE TABLE users (
        username VARCHAR(20) UNIQUE PRIMARY KEY NOT NULL,
        avatar_url VARCHAR(200),
        name VARCHAR(15) NOT NULL
      );
      `)
    })
    .then(() => {
      return db.query(`
      CREATE TABLE reviews (
        review_id SERIAL PRIMARY KEY,
        title VARCHAR(100) NOT NULL,
        review_body VARCHAR (1000) NOT NULL,
        designer VARCHAR(100),
        review_img_url VARCHAR(200) DEFAULT 'https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg',
        votes INT DEFAULT 0,
        category VARCHAR(50) NOT NULL, 
        FOREIGN KEY (category) REFERENCES categories(slug),
        owner VARCHAR(50) NOT NULL,
        FOREIGN KEY (owner) REFERENCES users(username),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      `)
    })
    .then(() => {
      return db.query(`
      CREATE TABLE comments (
        comment_id SERIAL PRIMARY KEY,
        author VARCHAR(20) NOT NULL,
        FOREIGN KEY (author) REFERENCES users(username),
        review_id INT NOT NULL,
        FOREIGN KEY (review_id) REFERENCES reviews(review_id),
        votes INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        body VARCHAR(1000) NOT NULL
      );
      `)
    })
    .then(()=> {
      // console.log("All tables created!")
      let categoryArr = categoryData.map((category) =>{
        return [category.slug, category.description]
      });
      const queryStr = format(`
      INSERT INTO categories
        (slug, description)
        VALUES
        %L;`, categoryArr)
      
      return db.query(queryStr)
    })
    .then(()=> {
      let userArr = userData.map((user) =>{
        return [user.username, user['avatar_url'], user.name]
      });
      const queryStr = format(`
      INSERT INTO users
        (username,avatar_url, name)
        VALUES
        %L;`, userArr)
      return db.query(queryStr)
    })
    .then(()=> {
      let reviewsArr = reviewData.map((review) =>{
        return [review.title, review['review_body'], review.designer, review['review_img_url'], review.votes, review.category, review.owner, review['created_at']]
      });
      const queryStr = format(`
      INSERT INTO reviews
        (title, review_body, designer, review_img_url, votes, category, owner, created_at)
        VALUES
        %L;`, reviewsArr)
      return db.query(queryStr)
    })
    .then(()=> {
      let commentsArr = commentData.map((comment) =>{
        return [comment.author, comment['review_id'], comment.votes, comment['created_at'], comment.body]
      });
      const queryStr = format(`
      INSERT INTO comments
        (author, review_id, votes, created_at, body)
        VALUES
        %L;`, commentsArr)
      return db.query(queryStr)
    })
    .then(()=> {
      //console.log("All tables populated!")
    })
    .catch((err) => {
      console.log(err)
    })
  }



module.exports = seed;
