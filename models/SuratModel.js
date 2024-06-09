const Sequelize = require("sequelize");
const db = require("../config/database.js");
const Permintaan = require("./PermintaanModel.js");
const Admin = require("./AdminModel.js");

const { DataTypes } = Sequelize;

const Surat = db.define('surat', {
    nomorSurat: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    idPermintaan: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
            model: Permintaan,
            key: 'idPermintaan'
        }
    },
    nip: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
            model: Admin,
            key: 'nip'
        }
    },
    qr: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    tanggal_terbit: {
        type: DataTypes.DATE,
        allowNull: false
    },
    valid_until: {
        type: DataTypes.DATE,
        allowNull: false
    }
}, {
    freezeTableName: true,
    timestamps: false
});

module.exports = Surat;
