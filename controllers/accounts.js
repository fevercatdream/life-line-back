const router = require('express').Router();
const { User } = require('../models');
const bcrypt = require('bcrypt');
const existsError = {
    error: true,
    message: 'An account already exists for the user with this email address',
};

router.put('/create', async (req, res) => {
    const user = await User.findOne({where:{email: req.body.email.toLowerCase()}})
    if(user) {
        res.status(409).send(existsError);
        return;
    }

   if(req.body.password.length === 0) {
       res.status(400).send({
           error: true,
           message: 'Password cannot be empty',
       })
       return;
   }
    // hash password, store in variable
    const hash = await bcrypt.hash(req.body.password, 10);

    // put hashed password in User.create()
    try {
        await User.create({
            email: req.body.email.toLowerCase(),
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
        user: "Max"
    })
})

module.exports = router;
