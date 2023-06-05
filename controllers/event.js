const router = require('express').Router();
const multer = require('multer');
const upload = multer();
const authMiddleware = require('../auth');
const models = require('../models');
const {storePhoto} = require("../storage");

// get, create, edit, delete
router.post('/create', authMiddleware, upload.array('photo'), async (req, res) => {
    // user id, event id, comment
    const user = req.user;

    try {
        const newEvent = await models.Event.create({
            UserId: user.id,
            description: req.body.description,
            date: req.body.date,
            title: req.body.title
        })

        for (let i = 0; i < req.files.length; i++) {
            const f = req.files[i];
            const url = await storePhoto(f);
            await models.EventPhoto.create({
                eventPhotoURL: url,
                EventId: newEvent.id,
            });
        }
        res.status(200).json(newEvent)
    } catch (err) {
        res.status(500).json(err)
    }

})

router.post('/like', authMiddleware, async (req, res) => {
    const user = req.user;
    const like = {
        UserId: user.id,
        EventId: req.body.eventId,
    };

    const liked = await models.EventLike.findOne({
        where: like,
    })

    if(!liked) {
        try {
            await models.EventLike.create(like)
        } catch (err) {
            res.status(500).json(err)
            return;
        }
    }

    res.status(200).json({})

})

router.delete('/like', authMiddleware, async (req, res) => {
    const user = req.user;

    try {
        await models.EventLike.destroy({
            where: {
                UserId: user.id,
                EventId: req.body.eventId,
            }
        })
        res.status(200).json({})
    } catch (err) {
        res.status(500).json(err)
    }
})

module.exports = router;
