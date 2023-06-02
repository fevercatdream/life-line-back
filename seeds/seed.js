const sequelize = require("../config/connection");

const models = require('../models');

async function run() {
    await models.User.create({
        name: 'TS',
        profilePhoto: 'https://placekitten.com/300/300',
        birthDate: '2012-02-04',
        birthPlace: 'Seattle',
        email: 'a@example.com',
        location: 'Seattle,'
    })
}
run();