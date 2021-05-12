const Users = require('../users/users-model')

function logger(req, res, next) {
  // DO YOUR MAGIC
  console.log(`${req.method} ${req.url} ${Date.now()}`)
  next()
}

function validateUserId(req, res, next) {
  const user = Users.getById(req.params.id)
  if(!user) {
    res.status(404).json({
      message: "user not found",
    })
  } else {
    req.user = user
    next()
  }
}

function validateUser(req, res, next) {
  if (!req.body || !req.body.name) {
    return res.status(400).json({
      message: 'missing required name field'
    })
  }
  next()
}

function validatePost(req, res, next) {
  if (!req.body || !req.body.text){
    return res.status(400).json({
      message: "missing required text field"
    })
  }
  next()
}

// do not forget to expose these functions to other modules
module.exports = {
  logger,
  validateUserId,
  validateUser,
  validatePost
}
