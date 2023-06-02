const router = require('express').Router();

const { User } = require('../models');


// GetUserProfileFromSession -> GET /api/profile
router.get('/', async (req, res) => {
    // get user ID from session
    const user = await User.findByPk(1 /* user ID from session */);
    if (!user) {
        return res.status(404).end(`There is no user`);
    }
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