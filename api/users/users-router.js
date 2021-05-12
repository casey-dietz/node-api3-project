const express = require('express')
const Users = require('./users-model')
const Posts = require('../posts/posts-model')

const { validateUserId, validateUser, validatePost } = require('../middleware/middleware')

// You will need `users-model.js` and `posts-model.js` both
// The middleware functions also need to be required

const router = express.Router();

router.get('/', (req, res) => {
  // RETURN AN ARRAY WITH ALL THE USERS
  Users.get()
    .then(users => {
      res.status(200).json(users)
    })
    .catch(err => {
      console.log(err.message)
      res.status(500).json(err.message)
    })
});

router.get('/:id', validateUserId, (req, res) => {
  // RETURN THE USER OBJECT
  // this needs a middleware to verify user id
  res.status(200).json(req.user)
});

router.post('/', validateUser, (req, res) => {
  // RETURN THE NEWLY CREATED USER OBJECT
  // this needs a middleware to check that the request body is valid
  Users.insert(req.body)
    .then(user => {
      res.status(201).json(user)
    })
    .catch(err => {
      console.log(err.message)
      res.status(500).json(err.message)
    })
});

router.put('/:id', validateUserId, validateUser, (req, res) => {
  // RETURN THE FRESHLY UPDATED USER OBJECT
  // this needs a middleware to verify user id
  // and another middleware to check that the request body is valid
  Users.update(req.params.id, req.body)
    .then(async () => {
      const updatedUser = await Users.getById(req.params.Id)
      res.status(200).json(updatedUser)
    })
    .catch(err => {
      console.log(err.message)
      res.status(500).json(err.message)
  })
});

router.delete('/:id', validateUserId, async (req, res) => {
  // RETURN THE FRESHLY DELETED USER OBJECT
  // this needs a middleware to verify user id
  const user = await Users.getById(req.params.id)
  Users.remove(req.params.id)
    .then(() => {
      res.status(200).json(user)
    })
    .catch(err => {
      console.log(err.message)
      res.status(500).json(err.message)
  })
});

router.get('/:id/posts', validateUserId, (req, res) => {
  // RETURN THE ARRAY OF USER POSTS
  // this needs a middleware to verify user id
  Users.getUserPosts(req.params.Id)
    .then(posts => {
      res.status(200).json(posts)
    })
    .catch(err => {
      console.log(err.message)
      res.status(500).json(err.message)
    })
});

router.post('/:id/posts', validateUserId, validatePost, (req, res) => {
  // RETURN THE NEWLY CREATED USER POST
  // this needs a middleware to verify user id
  // and another middleware to check that the request body is valid
  const newPost = Object.assign(req.body, {user_id: req.params.id})
  console.log(newPost)
  Posts.insert(newPost)
    .then(async post => {
      res.status(201).json(post)
    })
    .catch(err => {
      console.log(err.message)
      res.status(500).json(err.message)
    })
});

// do not forget to export the router
module.exports = router
