const router = require('express').Router();
const multer = require('multer');
const upload = multer();
const authMiddleware = require('../auth');
const models = require('../models');
const {storePhoto} = require("../storage");
const {EventPhoto} = require("../models");

// get, create, edit, delete
router.post('/create', authMiddleware, upload.array('photo'), async (req,res) => {
    // user id, event id, comment
    const user = req.user;
    console.log(req.files);

    try {
        const newEvent = await models.Event.create ({
            UserId: user.id,
            description: req.body.description,
            date: req.body.date,
        })

        for(let i = 0; i < req.files.length; i++) {
            const f = req.files[i];
            const url = await storePhoto(f);
            await EventPhoto.create({
                eventPhotoURL: url,
                EventId: newEvent.id,
            });
        }
        res.status(200).json(newEvent)
    } catch(err) {
        res.status(400).json(err);
    }

})

module.exports = router;
