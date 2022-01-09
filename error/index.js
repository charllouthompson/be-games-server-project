exports.handleCustomErrors = (err, req, res, next) => {
    if (err.status && err.msg) {
      res.status(err.status).send(err.msg);
    } else next(err);
};
  
exports.handlePsqlErrors = (err, req, res, next) => {
    if (err.code === '22P02') {
      res.status(400).send({ msg: 'Invalid text input' });
    } else if (err.code === '22P03') {
      res.status(400).send({ msg: 'Invalid binary input'})
    } else if (err.code === '22P05') {
      res.status(400).send({ msg: 'Invalid input due to untranslatable character'})
    } else next(err);
  };
  
exports.handleServerErrors = (err, req, res, next) => {
    res.status(500).send({ msg: 'Internal Server Error' });
  };