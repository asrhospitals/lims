require('dotenv').config();
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(process.env.DATABASE_NAME, 'postgres', process.env.DATABASE_PASSWORD, {
    host: process.env.DATABASE_HOST,
    dialect:process.env.DATABASE_DIA,
    port:process.env.DATABASE_PORT,
    dialectOptions: { //< Add this
        ssl: {
           require: true,
           rejectUnauthorized: false
        }
     } 
  });

  

module.exports = sequelize;
