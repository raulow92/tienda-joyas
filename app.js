const express = require('express')
const app = express()
const routes = require('./routes/routes')

const PORT = process.env.PORT || 3000

app.use('/', routes)

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
})