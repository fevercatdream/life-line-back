const router = require('express').Router();
const authMiddleware = require('../auth');
const {Friends, User} = require("../models");
const {Op} = require('sequelize');

router.post('/create-request', authMiddleware, async (req, res) => {
    const userId = req.user.id;
    const friendId = req.body.friendId;

    if (userId === friendId) {
        res.status(403).send({
            error: true,
            message: "You cannot be your own friend, sorry. Life is hard."
        })
        return;
    }

    const existing = await Friends.findOne({
        where: {
            LeftId: userId,
            RightId: friendId,
        }
    });

    if (existing) {
        res.send({
            error: false,
            alreadyExists: true,
        });
        return;
    }

    try {
        await Friends.create({
            LeftId: userId,
            RightId: friendId,
            isPending: true,
        })
        await Friends.create({
            LeftId: friendId,
            RightId: userId,
            isPending: true,
            isIncoming: true,
        })
    } catch (err) {
        res.status(500).send(err)
        return;
    }

    res.send({});
})

router.get('/requests', authMiddleware, async (req, res) => {
    const reqs = await Friends.findAll({
        where: {
            LeftId: req.user.id,
            isPending: true,
        }
    });

    res.send({
        friendRequests: reqs,
    });
})

router.post('/resolve-request', authMiddleware, async (req, res) => {
    const userId = req.user.id;
    const accept = req.body.acceptRequest;
    const friendId = req.body.friendId;

    const friendRequest = await Friends.findOne({
        where: {
            LeftId: userId,
            RightId: friendId,
            isPending: true,
            isIncoming: true,
        }
    });
    const other = await Friends.findOne({
        where: {
            LeftId: friendId,
            RightId: userId,
            isPending: true,
        }
    });

    if (!friendRequest || !other) {
        res.status(404).send({})
        return;
    }

    if (accept) {
        friendRequest.isPending = false;
        other.isPending = false;
        await friendRequest.save();
        await other.save();
    } else {
        await friendRequest.destroy();
        await other.destroy();
    }

    res.send({});
})

router.get('/', authMiddleware, async (req, res) => {
    const includePending = req.params.includePending === 'true' ? {} : {
        isPending: false,
    };
    const friends = await Friends.findAll({
        where: {
            LeftId: req.user.id,
            ...includePending,
        },
    })

    const ids = friends.map(x => x.RightId);
    console.log(ids);

    const users = await User.findAll({
        where: {
            id: {
                [Op.in]: ids,
            },
        }
    })

    res.send({
        friends: users,
    });
})

router.get('/all-users', authMiddleware, async (req, res) => {
    const users = await User.findAll({
        where: {
            id: {
                [Op.not]: req.user.id,
            },
        },
        attributes: {
            exclude: ['password', 'email'],
        },
    });
    const friends = await Friends.findAll({
        where: {
            LeftId: req.user.id,
        },
    })

    const userModels = users.map(u => {
        const friend = friends.find(x => x.RightId === u.id);
        const model = {
            ...u.dataValues
        }
        if (friend) {
            model.isPending = friend.isPending;
            model.isFriend = !friend.isPending;
        } else {
            model.isFriend = false;
        }
        return model;
    })

    res.send({
        users: userModels,
    });
})

module.exports = router;