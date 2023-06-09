const router = require('express').Router();
const multer = require('multer');
const upload = multer();
const { User, Friends, EventLike, Event, EventComment} = require('../models');
const authMiddleware = require('../auth');
const {storePhoto} = require('../storage')
const {Op} = require("sequelize");

// profile - get, create, update, delete

// GetUserProfileFromSession -> GET /api/profile
router.get('/', authMiddleware, async (req, res) => {
    const user = req.user;
    const friends = await Friends.findAll({
        where: {
            // every friend that user has
            LeftId: req.user.id,
            isPending: true,
            isIncoming: true,
        }
    })
    const likes = await EventLike.findAll({
        include: [
            {
                model: Event,
                where: {
                    UserId: req.user.id,
                }
            },
            {
                model: User,
                attributes: ['name', 'profilePhoto']
            }
        ],
    })
    const comments = await EventComment.findAll({
        include: [
            {
                model: Event,
                where: {
                    UserId: req.user.id,
                },
            },
            {
                model: User,
                attributes: ['name', 'profilePhoto']
            }
        ]
    })
    const pendingFriendsIds = friends.map( i => i.RightId);
    const users = await User.findAll({
        where: {
            id: {
                [Op.in]: pendingFriendsIds,
            },
        }
    })
    const usersById = new Map(users.map(i => [i.id,i]))
    console.log(usersById);
    console.log(user.id);
    res.send({
        id: req.user.id,
        likes: likes,
        comments: comments,
        new_friend_requests: friends.length,
        name: user.name,
        birthdate: user.birthDate,
        birthplace: user.birthPlace,
        current_location: user.location,
        pending_friends: friends.map((i) => ({
            friendId: i.RightId,
            createdAt: i.createdAt,
            name: usersById.get(i.RightId).name,
            profilePhoto: usersById.get(i.RightId).profilePhoto,
        })),
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
    try {
        req.user.profilePhoto = await storePhoto(req.file);
        await req.user.save();
    } catch (error) {
        console.log(error);
        res.status(500).send({
            error: true,
            message: 'Something went wrong...',
        });
        return;
    }
    
    res.send({
        error: false,
        url: req.user.profilePhoto}
    );
})

// delete profile

module.exports = router;