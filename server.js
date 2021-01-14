const express = require('express')
const cors = require('cors')

const connectDB = require('./config/db')

const app = express()

connectDB()

app.use(express.json({ extended: false }))

app.use(cors())

app.get('/', (req, res) => res.send('API Running'))

app.use('/api/users', require('./routes/api/users.js'),);
app.use('/api/auth', require('./routes/api/auth'),);
app.use('/api/profile', require('./routes/api/profile'),);
app.use('/api/posts', require('./routes/api/posts'),);

const PORT = process.env.PORT || 5000

app.listen(5000, () => console.log(`Express Server Started on port ${PORT} :)`))