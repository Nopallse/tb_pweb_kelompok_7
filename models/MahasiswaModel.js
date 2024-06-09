const Sequelize = require("sequelize");
const db = require("../config/database.js");
const Users = require("./UserModel.js");

const { DataTypes } = Sequelize;

const Mahasiswa = db.define('mahasiswa', {
    nim: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    departemen: {
        type: DataTypes.STRING,
        allowNull: false
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: false
    },
    gender: {
        type: DataTypes.ENUM("laki-laki", "perempuan"),
        allowNull: false
    },
    address: {
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

Mahasiswa.belongsTo(Users, { foreignKey: 'id' });

module.exports = Mahasiswa;
