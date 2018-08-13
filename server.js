const express = require('express')
const app = express()
const port = process.env.POST || 3000

app.listen(port)

console.log(`App started on http://localhost:${port}`)
