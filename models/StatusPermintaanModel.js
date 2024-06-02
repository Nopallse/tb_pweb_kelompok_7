import Sequelize from "sequelize";
import db from "../config/database.js";
import Permintaan from "./PermintaanModel.js";

const { DataTypes } = Sequelize;

const StatusPermintaan = db.define('statusPermintaan', {
    idStatus: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    idPermintaan: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Permintaan,
            key: 'idPermintaan'
        }
    },
    status: {
        type: DataTypes.STRING
    },
}, {
    freezeTableName: true,
    timestamps: false
});

export default StatusPermintaan;
