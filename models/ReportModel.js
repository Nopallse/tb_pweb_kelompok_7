const Sequelize = require("sequelize");
const db = require("../config/database.js");
const { DataTypes } = Sequelize;

const Report = db.define('report', {
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    subject: DataTypes.STRING,
    details: DataTypes.TEXT,
}, {
    freezeTableName: true,
    timestamps: true,
    timestamps: false
});

module.exports = Report;