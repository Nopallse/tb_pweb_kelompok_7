const Sequelize = require('sequelize');

const db = new Sequelize('aktif_kuliah','root','',{
    host:"localhost",
    dialect:"mysql",
    logging: false 

});

module.exports = db; 
