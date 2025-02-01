const { DataTypes } = require('sequelize');
const sequelize=require('../../../db/connectDB');

const PPPRegistration=sequelize.define('ppp',{
    patientname:{
        type:DataTypes.STRING,
        allowNull:false
    },
    gurdianname:{
        type:DataTypes.STRING,
        allowNull:false
    },
    age:{
        type:DataTypes.STRING,
        allowNull:false
    },
    gender:{
        type:DataTypes.STRING,
        allowNull:false
    },
    barcode:{
        type:DataTypes.INTEGER,
        allowNull:false,
        unique:true
    },
    refdoc:{
        type:DataTypes.STRING,
        allowNull:false
    },

    document:{
        type:DataTypes.STRING
    },
    area:{
        type:DataTypes.STRING  
    },
    city:{
        type:DataTypes.STRING
    },
    district:{
        type:DataTypes.STRING
    },
    op:{
        type:DataTypes.STRING,
        allowNull:false
    },
    opno:{
        type:DataTypes.STRING,
        allowNull:false
    },
    documenttype:{
        type:DataTypes.STRING
    },
    regdate:{
        type:DataTypes.DATEONLY,
        allowNull:false,
        defaultValue:DataTypes.NOW
    },
    mobilenumber:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    whatsappnumber:{
        type:DataTypes.STRING
    },
    emailid:{
        type:DataTypes.STRING
    },
    trfno:{
        type:DataTypes.INTEGER
    },
    remark:{
        type:DataTypes.STRING,
        allowNull:false
    },
    attatchfile:{
        type:DataTypes.STRING,
        allowNull:false
        
    }
});

PPPRegistration.belongsTo(require('../masterModel/hospitalMaster'),{foreignKey:'hospital_id'})

module.exports=PPPRegistration;