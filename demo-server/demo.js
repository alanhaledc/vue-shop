const user = require('./user')
const http = require('http')
const url = require('url')
const util = require('util')

console.log(`username: ${user.username}, I say ${user.sayhello()}`)

const server = http.createServer((req, res) => {
  res.statusCode = 200

  res.setHeader('Content-Type', 'text/plain; charset=utf-8')

  res.end(util.inspect(url.parse('http://127.0.0.1:3000/?name=hale&age=29#2233')))
})

server.listen(3000, () => {
  console.log('Server star http:127.0.0.1:3000')
})
