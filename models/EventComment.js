const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/connection");

class EventComment extends Model {

}

EventComment.init(
    {
        // id auto-generates
        comment: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
    },
    {
        sequelize
    }
);

module.exports = EventComment;