const sequelize = require("../config/connection");

const models = require('../models');
const bcrypt = require("bcrypt");

async function run() {
    const pass = await bcrypt.hash("password", 10)
    await models.User.bulkCreate([1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(x =>
            (
                {
                    name: 'Bernard Garbol '+x,
                    password: pass,
                    profilePhoto: 'https://placekitten.com/300/300',
                    birthDate: '2000-01-01',
                    birthPlace: 'Seattle',
                    email: `test-${x}@google.com`,
                    location: 'Seattle,'
                }
            )
        )
    )
}

run();