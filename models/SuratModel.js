import Sequelize from "sequelize";
import db from "../config/database.js";
import Permintaan from "./PermintaanModel.js";
import Admin from "./AdminModel.js";

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

export default Surat;
