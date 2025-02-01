const { DataTypes } = require('sequelize');
const sequelize = require('../../../db/connectDB');


const Profile=sequelize.define('profile',{
    profileEntryName:{
        type:DataTypes.STRING,
        allowNull:false
    },
    investigationName:{
        type:DataTypes.ARRAY(DataTypes.STRING),
        allowNull:false,
        defaultValue: []
    },
    isactive:{
        type:DataTypes.BOOLEAN,
        defaultValue:true
    }

})

module.exports=Profile