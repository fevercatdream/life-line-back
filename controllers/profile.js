const router = require('express').Router();
const multer = require('multer');
const upload = multer();
const { User } = require('../models');
const uuid = require('uuid');
const authMiddleware = require('../auth');
const s3 = require('@aws-sdk/client-s3');

// profile - get, create, update, delete
const s3Client = new s3.S3Client({region: 'us-west-2'});
const bucketName = 'life-line-upload-assets';
const bucketUrlPrefix = 'https://life-line-upload-assets.s3.us-west-2.amazonaws.com';

// GetUserProfileFromSession -> GET /api/profile
router.get('/', authMiddleware, async (req, res) => {
    const user = req.user;
    console.log(user.id);
    res.send({
        new_comments: 12,
        new_likes: 35,
        new_friend_requests: 5,
        name: user.name,
        birthdate: user.birthDate,
        birthplace: user.birthPlace,
        current_location: user.location,
        known_users: [
            {
                id: 0,
                profile_url: 'https://placekitten.com/300/300', // get placeholder image
            },
            {
                id: 1,
                profile_url: 'https://placekitten.com/300/300', // get placeholder image
            },
            {
                id: 2,
                profile_url: 'https://placekitten.com/300/300', // get placeholder image
            },
        ],
        profile_url: user.profilePhoto, // todo
        friend_count: 105,
        recent_event: {
            // EVENT OBJECT PLACEHOLDER
        },
        friends: [
            {
                id: 0,
                profile_url: 'https://placekitten.com/300/300', // get placeholder image
            },
            {
                id: 1,
                profile_url: 'https://placekitten.com/300/300', // get placeholder image
            },
            {
                id: 2,
                profile_url: 'https://placekitten.com/300/300', // get placeholder image
            },
        ],
    })
})

// update user profile settings
router.put('/update', authMiddleware, async (req, res) => {
    const user = req.user;
    console.log(user.id);
    if(!validate(req.body.name)){
        res.status(400).send({
            error: true,
            message: "Name not valid",
        })
        return;
    }
    user.name = req.body.name;
    // user.profilePhoto = req.body.profilePhoto;
    // validate date
    user.birthDate = req.body.birthDate;
    user.birthPlace = req.body.birthPlace;
    user.location = req.body.location;

    try {
        await user.save();
    } catch (error) {
        res.status(500).send({
            error: true,
            message: "Something went wrong",
        });
        console.log(error);
        return;
    }


    res.status(200).json({});
})

function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

function validate(input) {
    // string is not empty and not just whitespace
    return /\S/.test(input);
}

router.post('/photo', authMiddleware, upload.single('photo'), async (req, res) => {
    console.log(req.body, req.file);
    const ext = req.file.originalname.split('.').pop();
    const key = uuid.v4() + '.' + ext;
    console.log(key)

    try {
        const s3res = await s3Client.send(new s3.PutObjectCommand({
            Bucket: bucketName,
            Key: key,
            ContentType: req.file.mimetype,
            Body: req.file.buffer,
        }));
        req.user.profilePhoto = `${bucketUrlPrefix}/${key}`;
        await req.user.save();
    } catch (error) {
        console.log(error);
        res.status(500).send({
            error: true,
            message: 'Something went wrong...',
        });
        return;
    }

    res.send({error: false});
})

// delete profile

module.exports = router;