var _ = require('lodash') ;

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
    return blogs.map(b => b.likes).reduce((x, y) => x + y, 0)
}

const favoriteBlog = (blogs) => {
    const mostLikes = blogs.map(b => b.likes).reduce((x, y) => x > y ? x : y, 0)

    return blogs.filter(b => b.likes == mostLikes).pop()
}

function objectMap(object, mapFn) {
  return Object.keys(object).reduce(function(result, key) {
    result[key] = mapFn(object[key])
    return result
  }, {})
}

const mostBlogs = (blogs) => {
    const blogsGroupedByAuthor = _.groupBy(blogs, b => b.author)
    const authorBlogCounts = objectMap(blogsGroupedByAuthor, v => v.length)

    const maxCount = Object.entries(authorBlogCounts).map(x => x[1]).reduce((x, y) => x > y ? x : y, 0)
    const authorMaxCount = Object.entries(authorBlogCounts).filter(author_count => author_count[1] === maxCount).pop()[0]

    return { "author": authorMaxCount, "blogs": maxCount }
}

const mostLikes = (blogs) => {
    const blogsGroupedByAuthor = _.groupBy(blogs, b => b.author)
    const authorLikes = objectMap(blogsGroupedByAuthor, v => v.map(b => b.likes).reduce((x, y) => x + y, 0))

    const maxLikes = Object.entries(authorLikes).map(x => x[1]).reduce((x, y) => x > y ? x : y, 0)
    const authorMaxLikes = Object.entries(authorLikes).filter(author_count => author_count[1] === maxLikes).pop()[0]

    return { "author": authorMaxLikes, "likes": maxLikes }
}

module.exports = {
  dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes
}