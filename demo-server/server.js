const url = require('url')
const http = require('http')
// const util = require('util')
const fs = require('fs')

const server = http.createServer((req, res) => {
  const filename = url.parse(req.url).pathname
  console.log(url.parse(req.url))
  console.log(filename)
  fs.readFile(filename.substr(1), (err, data) => {
    if (err) {
      res.writeHead(404, {
        'Content-Type': 'text/html'
      })
    } else {
      res.writeHead(200, {
        'Content-Type': 'text/html'
      })
      res.write(data.toString())
    }

    res.end()
  })
})

server.listen(3000, () => {
  console.log('Server start http:127.0.0.1:3000')
})
