const router = require('express').Router();
const jwt = require('jsonwebtoken');

const { User } = require('../models');
const authMiddleware = require('../auth');

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

module.exports = router;