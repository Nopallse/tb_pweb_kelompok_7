const Sequelize = require('sequelize');

const db = new Sequelize('aktif_kuliah','root','',{
    host:"localhost",
    dialect:"mysql",
    logging: false 

});

module.exports = db; // Periksa bahwa Anda telah mengekspor db dengan benar
