const Sequelize = require("sequelize");
const db = require("../config/database.js");
const Mahasiswa = require("./MahasiswaModel.js");


const { DataTypes } = Sequelize;

const Permintaan = db.define('permintaan', {
    idPermintaan: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nim: {
        type: DataTypes.STRING,
        references: {
            model: Mahasiswa,
            key: 'nim'
        }
    },
    target: {
        type: DataTypes.STRING
    },
    tujuan: {
        type: DataTypes.STRING
    },
    namaOrangtua: {
        type: DataTypes.STRING
    },
    nip: {
        type: DataTypes.STRING
    },
    pangkatGolongan: {
        type: DataTypes.STRING
    },
    unitKerja: {
        type: DataTypes.STRING
    },
    instansiInduk: {
        type: DataTypes.STRING
    },
    status: {
        type: DataTypes.STRING
    },
    tanggal: {
        type: DataTypes.DATEONLY,
        defaultValue: Sequelize.NOW
    },
    waktu: {
        type: DataTypes.TIME,
        defaultValue: Sequelize.literal('CURRENT_TIME')
    }
}, {
    freezeTableName: true,
    timestamps: false
});

Permintaan.belongsTo(Mahasiswa, { foreignKey: 'nim' });

module.exports = Permintaan;

