import Sequelize from "sequelize";
import db from "../config/database.js";
import Permintaan from "./PermintaanModel.js";

const { DataTypes } = Sequelize;

const StatusPermintaan = db.define('statusPermintaan', {
    idStatus: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    idPermintaan: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
            model: Permintaan,
            key: 'idPermintaan'
        }
    },
    tanggal: {
        type: DataTypes.STRING
    },
    status: {
        type: DataTypes.STRING
    },
}, {
    freezeTableName: true,
    timestamps: false
});

export default StatusPermintaan;
