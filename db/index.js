
const sequalize = require('../config/connection');
const models = require('../models');

async function run() {
    console.log(process.env);
    await sequalize.sync({force: true})
}

run()