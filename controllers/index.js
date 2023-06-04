const router = require('express').Router();

const profileRouter = require('./profile');
const accountsRouter = require('./accounts');
const commentRouter = require('./comment');
const eventRouter = require('./event');

router.use('/api/profile', profileRouter);
router.use('/api/account', accountsRouter);
router.use('/api/comment', commentRouter);
router.use('/api/event', eventRouter);

module.exports = router;