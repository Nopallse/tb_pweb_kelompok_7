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
        type: DataTypes.INTEGER,  // This should be INTEGER to match Permintaan's primary key type
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

// Define the association after model definition
Permintaan.hasOne(Surat, { foreignKey: 'idPermintaan' });
Surat.belongsTo(Permintaan, { foreignKey: 'idPermintaan' });
Surat.belongsTo(Admin, { foreignKey: 'nip' });

module.exports = Surat;
