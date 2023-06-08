const router = require('express').Router();
const multer = require('multer');
const upload = multer();
const authMiddleware = require('../auth');
const models = require('../models');
const {storePhoto} = require("../storage");
const {EventComment, EventPhoto, EventLike, User} = require("../models");

async function getTimeline(userId) {
    const events = await models.Event.findAll({
        where: {UserId: userId},
        include: [
            {
                model: EventComment,
                include: [
                    {
                        model:User,
                        attributes: ['id', 'profilePhoto', 'name'],
                    },
                ],
                order: [
                    ['createdAt', 'DESC'],
                ],
            },
            {model: EventPhoto},
            {
                model: EventLike,
                required: false,
            }
        ],
        // order: [
        //     ['date', 'ASC'],
        // ]
    })

    const eventModels = events.map(e => ({
        eventId: e.id,
        title: e.title,
        description: e.description,
        date: e.date,
        comments: e.EventComments,
        commentsCount: e.EventComments.length,
        photos: e.EventPhotos.map(p => ({
            id: p.id,
            description: p.description,
            url: p.eventPhotoURL,
        })),
        likeCount: e.EventLikes.length,
        userLiked: !!e.EventLikes.find(l => l.UserId === userId),
    }));

    return eventModels;
}

router.get('/view', authMiddleware, async (req, res) => {
    // description, photos, comments, likes
    // add id on the front end

    res.send({
        eventList: await getTimeline(req.user.id),
    })
})

// get, create, edit, delete
router.get('/view/:id', authMiddleware, async (req, res) => {
    // description, photos, comments, likes
    // add id on the front end

    res.send({
        eventList: await getTimeline(req.params.id),
    })
})

module.exports = router;
