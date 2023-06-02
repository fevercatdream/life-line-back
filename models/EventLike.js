const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/connection");

class EventLike extends Model {}

EventLike.init(
    {
        /** xref table, both FKs will auto generate from index.js **/
    },
    {
        sequelize,
    }
);

module.exports = EventLike;
