const express = require('express')
const dotenv = require('dotenv')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const { check, validationResult } = require('express-validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const cors = require('cors')
const connectDB = require('./config/db')
const app = express()

dotenv.config({ path: './config/.env' })

connectDB();

const Favorite = require('./models/Favorite')
const User = require('./models/User')

app.use(bodyParser.json())
app.use(cors())
app.use(morgan('tiny'))

const server = app.listen(5000, () => {
  console.log('listening on 5000')
})

// Handle promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`)
  server.close(() => process.exit(1))
})

app.get('/favorites', (req, res) => {
  Favorite.find()
    .then(data => {
      res.status(200).json(data)
    })
})

app.post('/favorites', (req, res) => {
  Favorite.create(req.body)
    .then(data => {
      res.status(201).json(data)
    }).catch(console.error)
})

app.post('/register',
  [
    check('username', 'Please enter a valid username').not().isEmpty(),
    check('email', 'Please enter a valid email').isEmail(),
    check('password', 'Password must be at least 6 characters').isLength({ min: 6 })
  ], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password } = req.body;
    try {
      let user = await User.findOne({ username });
      if (user) {
        return res.status(400).json({
          msg: "User Already Exists"
        });
      }

      user = new User({ username, email, password });

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      await user.save();

      const payload = { user_id: user.id }

      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        (err, token) => {
          if (err) throw err;
          res.status(200).json({
            token
          });
        }
      );
    } catch (err) {
      console.log(err.message);
      res.status(500).send("Error in Saving");
    }
  });

app.post('/login',
  [
    check("username", "Please enter a valid username").isLength({ min: 1 }),
    check("password", "Please enter a valid password").isLength({ min: 6 })
  ], async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    console.log(req.body)
    const { username, password } = req.body
    try {
      let user = await User.findOne({ username })
      if (!user) {
        return res.status(400).json({ message: "Incorrect username or password" })
      }
      const isMatch = await bcrypt.compare(password, user.password)
      if (!isMatch) {
        return res.status(400).json({ message: "Incorrect username or password" })
      }
      const payload = { user_id: user.id }
      jwt.sign(payload, process.env.JWT_SECRET, (err, token) => {
        if (err) throw err;
        res.status(200).json({ token })
      })
    } catch (err) {
      console.error(err)
      res.status(500).json({ message: "Server Error" })
    }
  })