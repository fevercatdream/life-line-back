const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/connection");

class Event extends Model {

}

Event.init(
    {
        // id auto-generates
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        date: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    },
    {
        sequelize
    }
);

module.exports = Event;