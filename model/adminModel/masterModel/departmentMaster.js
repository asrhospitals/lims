const { DataTypes } = require('sequelize');
const sequelize = require('../../../db/connectDB');

const DeparmentMaster = sequelize.define('departmentmaster', {
  dptName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
});

module.exports = DeparmentMaster;