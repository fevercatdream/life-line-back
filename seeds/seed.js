const sequelize = require("../config/connection");

const models = require('../models');
const bcrypt = require("bcrypt");

async function run() {
    await models.User.create({
        name: 'Bernard Garbol',
        password: await bcrypt.hash("password", 10),
        profilePhoto: 'https://placekitten.com/300/300',
        birthDate: '2000-01-01',
        birthPlace: 'Seattle',
        email: 'test@google.com',
        location: 'Seattle,'
    })
}
run();