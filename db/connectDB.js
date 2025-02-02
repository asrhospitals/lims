require('dotenv').config();
const { Sequelize } = require("sequelize");
const sequelize = new Sequelize(process.env.DB_URL,{  dialect: 'postgres', });
console.log(process.env.DB_URL);

module.exports = sequelize;
