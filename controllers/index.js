const router = require('express').Router();

const profileRouter = require('./profile');
const accountsRouter = require('./accounts');

router.use('/api/profile', profileRouter);
router.use('/api/account', accountsRouter);

module.exports = router;