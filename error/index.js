exports.handleCustomErrors = (err, req, res, next) => {
  console.log("in top of custom error")
    if (err.status && err.msg) {
      console.log("in error")
      res.status(err.status).send(err.msg);
    } else next(err);
  };
  
// use promise.reject
//"not-an-id in reviews/review_id" if pparam not a numbers promise.reject, status 400

//write tests and see what errors need to have an error forced using promise.reject

//set list of valid properties in an array




exports.handlePsqlErrors = (err, req, res, next) => {
  console.log("in top of psql error")
    if (err.code === '22P02') {
      res.status(400).send({ msg: 'Invalid text input' });
    } else if (err.code === '22P03') {
      res.status(400).send({ msg: 'Invalid binary input'})
    } else if (err.code === '22P05') {
      res.status(400).send({ msg: 'Invalid input due to untranslatable character'})
    } else next(err);
  };
  
exports.handleServerErrors = (err, req, res, next) => {
  console.log("in top of server error")
    console.log(err);
    res.status(500).send({ msg: 'Internal Server Error' });
  };