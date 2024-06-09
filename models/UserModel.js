const Sequelize = require("sequelize");
const db = require("../config/database.js");

const { DataTypes } = Sequelize;

const Users = db.define('users', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    email: {
        type: DataTypes.STRING
    },
    password: {
        type: DataTypes.STRING
    },
    role: {
        type: DataTypes.STRING
    },
    refresh_token: { 
        type: DataTypes.STRING
    }
}, {
    freezeTableName: true
});

module.exports = Users;
