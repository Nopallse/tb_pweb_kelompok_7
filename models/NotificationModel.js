const Sequelize = require("sequelize");
const db = require("../config/database.js");
const User = require("./UserModel.js");
const Users = require("./UserModel.js");

const { DataTypes } = Sequelize;

const Notification = db.define('notification', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    userId: {
        type: DataTypes.INTEGER
    },
    title: {
        type: DataTypes.STRING
    },
    message: {
        type: DataTypes.STRING
    },
    href: {
        type: DataTypes.STRING
    },
    tanggal: {
        type: DataTypes.STRING
    },
}, {
    freezeTableName: true,
    timestamps: false
});

// Menentukan hubungan antara Notification dan Users
Notification.belongsTo(Users, { foreignKey: 'userId' });

module.exports = Notification;
