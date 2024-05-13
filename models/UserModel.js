import Sequelize from "sequelize";
import db from "../config/database.js";

const { DataTypes } = Sequelize;

const Users = db.define('users', {
    name: {
        type: DataTypes.STRING
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
    },departemen: {
        type: DataTypes.STRING
    },
    hp: {
        type: DataTypes.STRING
    },
    nim: {
        type: DataTypes.STRING
    }
}, {
    freezeTableName: true
});

export default Users;
