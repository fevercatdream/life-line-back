const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/connection");

class EventPhoto extends Model {

}

EventPhoto.init(
    {
        // id auto-generates
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        eventPhotoURL: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    },
    {
        sequelize
    }
);

module.exports = EventPhoto;