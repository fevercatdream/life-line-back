const router = require('express').Router();
const { User } = require('../models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const existsError = {
    error: true,
    message: 'An account already exists for the user with this email address',
};

// account - log in and log out

router.put('/create', async (req, res) => {
    let user = await User.findOne({where:{email: req.body.email.toLowerCase()}})
    if(user) {
        res.status(409).send(existsError);
        return;
    }

    const email = req.body.email.toLowerCase();
    const password = req.body.password;

    if(password.length === 0) {
       res.status(400).send({
           error: true,
           message: 'Password cannot be empty',
       })
       return;
    }
    // hash password, store in variable
    const hash = await bcrypt.hash(password, 10);

    // put hashed password in User.create()
    try {
        user = await User.create({
            email: email,
            password: hash,
        })
    } catch (err) {
        if (err.name === 'SequelizeUniqueConstraintError') {
            res.status(409).send(existsError);
            return;
        }
        res.status(500).send({
            error: true,
            message: err.name,
        })
        console.log(err);
    }
    res.send({
        token: jwt.sign({id: user.id, email: user.email}, "cat"),
    })
})

router.post('/token', async (req, res) => {
    const authErr = {
        error: true,
        message: "Bad username / password",
    }

    console.log(req.body);

    if (!req.body.email || !req.body.password) {
        res.status(403).send(authErr)
        return;
    }

    const email = req.body.email.toLowerCase();
    const password = req.body.password;

    const user = await User.findOne({where:{email: email}})
    if(!user){
        res.status(403).send(authErr)
        return;
    }

    const matches = await bcrypt.compare(password, user.password)
    if(!matches){
        res.status(403).send(authErr)
        return;
    }

    const token = jwt.sign({id: user.id, email: user.email}, "cat");

    res.send({
        token: token
    });
})

module.exports = router;
