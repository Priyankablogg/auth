const router = require('express').Router();
const User = require('../model/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { registerValidation, loginValidation } = require('../validation');
const { validate } = require('../model/User');

router.post('/register', async (req,res) =>{
// LETS VALEDATE THE DATA BEFORE WE A USER
const { error } = registerValidation(req.body);
if(error) return res.status(400).send(error.details[0].message); 

// Checking if the user is already in the database
const emailExit = await User.findOne({ email: req.body.email});
if(emailExit) return res.status(400).send('Email already exists');    

//Hash passwords
const saltRounds = 10;
const yourPassword = await  bcrypt.hash(req.body.password, saltRounds);
bcrypt.genSalt(saltRounds, function(err, salt) {
    bcrypt.hash(yourPassword, salt, function(err, hash) {
//       // Store hash in your password DB.
    });
  });

//Create  anew user
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: yourPassword
    });
    try{
        const savedUser = await user.save();
        res.send({user: user._id });
    }catch(err){
        res.status(400).send(err);
    }
});

//LOG IN
router.post('/login', async(req,res) => {
    // LETS VALEDATE THE DATA BEFORE WE A USER
    const { error } = loginValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message); 
    // Checking if the email exists
    const user = await User.findOne({ email: req.body.email});
    if(!user) return res.status(400).send('Email is not found');  
    //PASSWORD IS CORRECT
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if (!validPass) return res.status(400).send('Invalid password');

   //Create and assign a token
    const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET);
    res.header('auth-token', token).send(token);

    res.send('Logged in!')
});

module.exports = router;


