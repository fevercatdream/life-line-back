const router = require('express').Router();
const multer = require('multer');
const upload = multer();
const authMiddleware = require('../auth');
const models = require('../models');
const {storePhoto} = require("../storage");
const {EventComment, EventPhoto, EventLike} = require("../models");

// get, create, edit, delete
router.get('/view/:id', authMiddleware, upload.array('photo'), async (req, res) => {
    // description, photos, comments, likes
    // add id on the front end
    console.log(req.params)
    const events = await models.Event.findAll({
        where: {UserId: req.params.id},
        include: [
            {model: EventComment},
            {model: EventPhoto},
            {
                model: EventLike,
                required: false,
            }
        ],
    })

    console.log(events);
    const eventModels = events.map(e => ({
        eventId: e.id,
        description: e.description,
        date: e.date,
        commentsCount: e.EventComments.length,
        photos: e.EventPhotos.map(p => ({
            id: p.id,
            description: p.description,
            url: p.eventPhotoURL,
        })),
        likeCount: e.EventLikes.length,
        userLiked: !!e.EventLikes.find(l => l.UserId === req.user.id),
    }));

    res.send({
        eventList: eventModels
    })
})

module.exports = router;
