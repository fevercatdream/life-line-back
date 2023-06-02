const jwt = require('jsonwebtoken');
const {User} = require('../models');

const withAuth = async (req, res, next) => {
    if (!req.body.token) {
        res.status(403).send({
            error: true,
            message: 'No authorization token present in request',
        });
        return;
    }

    try {
        const token = jwt.verify(req.body.token, 'cat');
        const user = await User.findByPk(token.id);
        if (!user) {
            res.status(400).send({
                error: true,
                message: 'JWT contained invalid user ID',
            });
            return;
        }
        req.user = user;
    } catch {
        res.status(403).send({
            error: true,
            message: 'Failed to validate or parse provided JWT',
        });
        return;
    }
    next();
}

module.exports = withAuth