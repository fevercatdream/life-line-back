const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/connection");
const bcrypt = require("bcrypt");

class User extends Model {
    // checkPassword(loginPw) {
    //     return bcrypt.compareSync(loginPw, this.password);
    // }
}

User.init(
    {
        // id auto-generates
        name: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        profilePhoto: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        birthDate: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        birthPlace: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        location: {
            type: DataTypes.STRING,
            allowNull: true,


        },
    },
    {
        sequelize,
    //     hooks: {
    //         beforeCreate: (userObj) => {
    //             userObj.password = bcrypt.hashSync(userObj.password, 5);
    //             return userObj;
    //         },
    //     },
    }
);

module.exports = User;
