const express = require('express');
const User = require('../models/User.model');
const bcrypt = require("bcryptjs");
const { route } = require('.');
const router = express.Router();

// with the get we get the info from the user => always need a get => its the render
router.get('/signup', (req, res) => {
    // render doesnt take a /, res.render goies to the views folder
    res.render('auth/signup')
})

// we have a post to send to the db => post is always a promise
router.post('/signup', async (req, res) => {
    // the ... creates a shallow copy
    const body = {...req.body};
    const salt = await bcrypt.genSalt(13);
    const passwordHash = bcrypt.hashSync(body.password, salt);
    // we delete the original pw
    // if (body.password.length <6) {}
    delete body.password;
    // because we're sending pwhash in the db, it has to be named the same in the model
    body.passwordHash = passwordHash;
    console.log(body)
    try {
        // this line below sends to the db
        await User.create(body);
        res.send(body);
    }
    catch (err) {
        console.log(err);
    }
});



// GET route for the login from the lesson ==> to display the login form to users
router.get('/login', (req, res) => res.render('auth/login'));



// POST login route ==> to process form data
router.post('/login', async (req, res) => {
    console.log('SESSION =====> ', req.session)
    const body = req.body
  
    const userMatch = await User.find({ username: body.username })
    console.log(userMatch)
    if (userMatch.length) {
      // User found
      const user = userMatch[0]
  
      if (bcrypt.compareSync(body.password, user.passwordHash)) {
        // Correct password
        console.log(user)
        // without the below line it won`t work - we`re assignig the value of user to data we're accessing (session.user)
        req.session.user = user
        
        // Not to send any hashes => use the same logic we did with the password but for the hash 


        res.render('profile', { user })
      } else {
        // Incorrect password
      }
    } else {
      // User not found
    }
  })
  


// what is this line for?
module.exports = router;