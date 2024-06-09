const Sequelize = require("sequelize");
const db = require("../config/database.js");
const Users = require("./UserModel.js");

const { DataTypes } = Sequelize;

const Admin = db.define('admin', {
    nip: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    pangkat_golongan: {
        type: DataTypes.STRING,
        allowNull: false
    },
    jabatan: {
        type: DataTypes.STRING,
        allowNull: false
    },
    fakultas: {
        type: DataTypes.STRING,
        allowNull: false
    },
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Users,
            key: 'id'
        }
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.NOW
    },
    updated_at: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.NOW
    }
}, {
    freezeTableName: true,
    timestamps: false
});

Admin.belongsTo(Users, { foreignKey: 'id' });

module.exports = Admin;
