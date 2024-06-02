import Sequelize from "sequelize";
import db from "../config/database.js";

const { DataTypes } = Sequelize;

const Permintaan = db.define('permintaan', {
    idPermintaan: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nim: {
        type: DataTypes.STRING
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
        type: DataTypes.DATEONLY,  // Only store the date part
        defaultValue: DataTypes.NOW
    },
    waktu: {
        type: DataTypes.TIME,  // Only store the time part
        defaultValue: Sequelize.literal('CURRENT_TIME')
    }
}, {
    freezeTableName: true,
    timestamps: false  // Disable `createdAt` and `updatedAt`
});

export default Permintaan;
