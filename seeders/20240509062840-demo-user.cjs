const bcrypt = require('bcryptjs');
'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
   
     await queryInterface.bulkInsert('Users', [{
        email: '2211522020_naufal@student.unand.ac.id',
        name: 'Naufal',
        nim: '2211522020',
        password: await bcrypt.hash('naufal',10),
        role:'mahasiswa',
        departemen:'Sistem Informasi',
        hp:'087780687924',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        email: '2211523004_fajrin@student.unand.ac.id',
        name: 'Fajrin Putra Pratama',
        nim: '2211523004',
        password: await bcrypt.hash('fajrin',10),
        role:'mahasiswa',
        departemen:'Sistem Informasi',
        hp:'081267610111',
        createdAt: new Date(),
        updatedAt: new Date(),
       },
       {
        email: '2211522026_alfa@student.unand.ac.id',
        name: 'Alfa Rian',
        nim: '2211522026',
        password: await bcrypt.hash('rian',10),
        role:'mahasiswa',
        departemen:'Sistem Informasi',
        hp:'081267234411',
        createdAt: new Date(),
        updatedAt: new Date(),
       },
      {
        email: 'admin@gmail.com',
        name: 'Admin',
        nim: '22221111000',
        password: await bcrypt.hash('admin',10),
        role:'admin',
        departemen:'fti',
        hp:'081267612311',
        createdAt: new Date(),
        updatedAt: new Date(),
       }
   
   
   ],{});
     
  },

  async down (queryInterface, Sequelize) {
     await queryInterface.bulkDelete('Users', null, {});
  }
};
