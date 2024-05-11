import {Sequelize} from "sequelize";

const db = new Sequelize('aktif_kuliah','root','',{
    host:"localhost",
    dialect:"mysql"
});

export default db;  