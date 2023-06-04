const router = require('express').Router();
const authMiddleware = require('../auth');
const models = require('../models');

// get, create, edit, delete
router.post('/create', authMiddleware, async (req,res) => {
// user id, event id, comment
    const user = req.user;
    console.log(user.id);

    try {
        const newComment = await models.EventComment.create ({
            UserId: user.id,
            comment: user.comment,

        })
        res.status(200).json(newComment)
    } catch(err) {
        res.status(400).json(err);
    }

})

module.exports = router;
