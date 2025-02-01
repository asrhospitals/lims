const { DataTypes } = require('sequelize');
const sequelize=require('../../../db/connectDB');
const Hospital=require('../../adminModel/masterModel/hospitalMaster');

const User=sequelize.define('user',{
    user_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
    username:{
        type:DataTypes.STRING,
        allowNull:false,
        unique:true
    },
    password:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    role:{
        type:DataTypes.ENUM('admin','reception','doctor','technician','phlebotomist'),
        allowNull:false,
    },
    module:{
        type:DataTypes.STRING,
        allowNull:false
    },
    firstName:{
        type:DataTypes.STRING,
        allowNull:false
    },
    lastname:{
        type:DataTypes.STRING
    },
    email:{
        type:DataTypes.STRING
    },
    menuexpand:{
        type:DataTypes.BOOLEAN,
        allowNull:false
    },
    isactive:{
        type:DataTypes.BOOLEAN,
        allowNull:false
    },
    hospital_id: {
        type: DataTypes.INTEGER,
        allowNull: true, // Allow null for admin users
        references: {
          model: Hospital,
          key: 'hospital_id',
        },
        onDelete: 'SET NULL', // If a hospital is deleted, set this field to NULL
      },
    


});

Hospital.hasMany(User, { foreignKey: 'hospital_id', onDelete: 'CASCADE' }); // A hospital has many users
User.belongsTo(Hospital, { foreignKey: 'hospital_id' }); // A user belongs to a hospital




module.exports=User;