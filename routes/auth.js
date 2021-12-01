const router = require('express').Router();
const User = require('../model/User');


// VALIDATION
const joi = require('@hapi/joi');

const schema = joi.object({
    name: joi.string().min(6).required(),
    email: joi.string().min(6).required().email(),
    password: joi.string().min(6).required(),
});

router.post('/register', async (req,res) =>{

    // LETS VALEDATE THE DATA BEFORE WE A USER
    const {error} = schema.validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);


    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    });
    try{
        const savedUser = await user.save();
        res.send(savedUser);
    }catch(err){
        res.status(400).send(err);
    }
});




module.exports = router;