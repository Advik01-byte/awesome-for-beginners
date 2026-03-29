// Express server missing body parsing and route typo
const express = require('express')
const app = express()
let todos = []
app.post('/todo', (req, res) => {
  todos.push(req.body) // will be undefined without body parser
  res.send('ok')
})
app.listen(3000)
