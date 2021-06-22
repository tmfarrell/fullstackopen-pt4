const blogListRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/users')

require('express-async-errors')

const jwt = require('jsonwebtoken')

const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7)
  }
  return null
}

blogListRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })

  response.json(blogs.map(blog => blog.toJSON()))
})

blogListRouter.get('/:id', async (request, response, next) => {
  const blog = await Blog.findById(request.params.id)
  if (blog) {
    response.json(blog.toJSON())
  } else {
    response.status(404).end()
  }
})

blogListRouter.post('/', async (request, response, next) => {
  try {
      const token = getTokenFrom(request)
      const decodedToken = jwt.verify(token, process.env.SECRET)
      if (!token || !decodedToken.id) {
        return response.status(401).json({ error: 'token missing or invalid' })
      }
      const user = await User.findById(decodedToken.id)

      const blog = new Blog({
        title: request.body.title,
        author: request.body.author,
        likes: request.body.likes,
        url: request.body.url,
        user: user._id
      })

      const savedblog = await blog.save()

      user.blogs = user.blogs.concat(savedblog._id)
      await user.save()

      response.json(savedblog.toJSON())
  } catch(exception) {
      response.status(400).end()
  }
})

blogListRouter.delete('/:id', async (request, response, next) => {
  const blog = await Blog.findByIdAndRemove(request.params.id)
  response.status(204).end()
})

blogListRouter.put('/:id', async (request, response, next) => {
  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, request.body, { new: true })

  response.json(updatedBlog.toJSON())
})

module.exports = blogListRouter