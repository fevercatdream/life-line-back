const router = require('express').Router();
const authMiddleware = require('../auth');
const models = require('../models');
const {Event} = require("../models");

// get, create, edit, delete
router.post('/create', authMiddleware, async (req,res) => {
// user id, event id, comment
    const user = req.user;

    try {
        const event = await Event.findByPk(req.body.eventId);
        if(!event) {
            res.status(400).send({
                error: true,
                message: "No event exists with that ID",
            })
            return;
        }
        const newComment = await models.EventComment.create ({
            UserId: user.id,
            EventId: req.body.eventId,
            comment: req.body.comment,


        })
        res.status(200).json(newComment)
    } catch(err) {
        res.status(400).json(err);
    }

})

module.exports = router;
