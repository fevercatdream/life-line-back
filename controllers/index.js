const router = require('express').Router();

const profileRouter = require('./profile');
const accountsRouter = require('./accounts');
const commentRouter = require('./comment');
const eventRouter = require('./event');
const timelineRouter = require('./timeline');
const friendsRouter = require('./friends');

router.use('/api/profile', profileRouter);
router.use('/api/account', accountsRouter);
router.use('/api/comment', commentRouter);
router.use('/api/event', eventRouter);
router.use('/api/timeline', timelineRouter);
router.use('/api/friends', friendsRouter);


module.exports = router;