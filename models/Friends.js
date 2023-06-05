const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/connection");

class Friends extends Model {}

Friends.init(
    {
        /** xref table, both FKs will auto generate from index.js **/
        isPending: {
            type: DataTypes.BOOLEAN,
        },
        isIncoming: {
            type: DataTypes.BOOLEAN,
        },
    },
    {
        sequelize,
    }
);

module.exports = Friends;
