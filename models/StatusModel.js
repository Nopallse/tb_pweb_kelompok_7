import Sequelize from "sequelize";
import db from "../config/database.js";
import Permintaan from "./PermintaanModel.js";

const { DataTypes } = Sequelize;

const StatusPermintaan = db.define('statusPermintaan', {
    idPermintaan: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
            model: Permintaan,
            key: 'idPermintaan'
        }
    },
    status: {
        type: DataTypes.STRING
    },
    createdAt: {
        type: DataTypes.DATE,
        primaryKey: true,
        defaultValue: Sequelize.NOW
    }
}, {
    freezeTableName: true,
    timestamps: false
});

export default StatusPermintaan;
