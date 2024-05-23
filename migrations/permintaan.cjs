'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('permintaan', {
      idPermintaan: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      target: {
        type: Sequelize.STRING
      },
      tujuan: {
        type: Sequelize.STRING
      },
      namaMahasiswa: {
        type: Sequelize.STRING
      },
      nim: {
        type: Sequelize.STRING
      },
      departemen: {
        type: Sequelize.STRING
      },
      namaOrangtua: {
        type: Sequelize.STRING
      },
      nip: {
        type: Sequelize.STRING
      },
      pangkatGolongan: {
        type: Sequelize.STRING
      },
      unitKerja: {
        type: Sequelize.STRING
      },
      instansiInduk: {
        type: Sequelize.STRING
      },
      nama_berkas: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('permintaan');
  }
};
