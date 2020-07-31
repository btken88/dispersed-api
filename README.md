# Dispersed API

## Table of Contents

- [Dispersed API](#dispersed-api)
  - [Table of Contents](#table-of-contents)
  - [General Info](#general-info)
  - [Technologies](#technologies)
  - [Setup](#setup)
  - [Example Code](#example-code)
  - [Features](#features)
  - [Status](#status)
  - [Contact](#contact)
  - [License](#license)

## General Info

This is a Node and Express backend server with MongoDB for the Dispersed App, a web application designed to let users find and save dispersed camping sites across the United States. I used JWT and bcrypt for secure password hashing/storage and secure token authentication/authorization for users.

## Technologies

- JavaScript
- Node.js
- Express
- MongoDB
- mongoose
- body-parser
- bcrypt
- JWT

## Setup

To get the Dispersed API installed and running, first clone the Github Repository into your directory and navigate to the API folder to install the required node packeges:

```bash
cd dispersed-api
npm install
```

You will have to create and connect your own MongoDB database by creating a .env file and saving the link to the database as `MONGO_URI`. Then start up the node server - notice that the app is setup to run the backend on port 5000:

```bash
node server.js
```

## Example Code

```javascript
  app.post('/login',
  [
    check('username', 'Please enter a valid username').not().isEmpty(),
    check('password', 'Password must be at least 6 characters').isLength({ min: 6 })
  ], async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.errors })
    }
    const { username, password } = req.body
    try {
      let user = await User.findOne({ username })
      if (!user) {
        return res.status(400).json({ errors: ["Incorrect username or password"] })
      }
      const isMatch = await bcrypt.compare(password, user.password)
      if (!isMatch) {
        return res.status(400).json({ errors: ["Incorrect username or password"] })
      }
      const payload = { user_id: user.id }
      jwt.sign(payload, process.env.JWT_SECRET, (err, token) => {
        if (err) throw err;
        res.status(200).json({ token })
      })
    } catch (err) {
      console.error(err)
      res.status(500).json({ errors: ["Server Error"] })
    }
  })

function authorizeUser(req, res, next) {
  const token = req.header('Authorization')
  if (!token) {
    return res.status(401).json({ errors: ["Authorization error"] })
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user_id = decoded.user_id;
    next()
  } catch (err) {
    console.error(err)
    res.status(500).send({ errors: ['Invalid token'] })
  }
}
```

## Features

Current Features:

- Create a secure User login with hashed password
- Authorize users with a token before allowing access to the favorites route
- Post, update, and delete favorite sites

Future Features:

- Reset passwords securely
- Make favorites have a public view option set by the user
- Allow users to update their information
- Set different levels of user permissions

## Status

The application is fully functional and ready to be enjoyed as is. Future updates and improvements are still a possibility.

## Contact

Created by [Bryce Kennedy](https://www.linkedin.com/in/bryce-kennedy/)

If you have any questions or suggestions feel free to reach out to me.

## License

[Click to view](https://github.com/btken88/dispersed-api/blob/master/license.txt)
