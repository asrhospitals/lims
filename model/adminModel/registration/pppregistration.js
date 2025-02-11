const { DataTypes } = require("sequelize");
const sequelize = require("../../../db/connectDB");
const Hospital = require("../masterModel/hospitalMaster");
const User = require("../../authModel/authenticationModel/userModel");

const Patient = sequelize.define("ppp", {
  patient_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  patient_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  gurdian_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  patient_age: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  patient_gender: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  patient_barcode: {
    type: DataTypes.STRING, // ✅ Changed from INTEGER to STRING
    allowNull: false,
    unique: true,
  },
  refdoc: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  document: {
    type: DataTypes.STRING,
  },
  area: {
    type: DataTypes.STRING,
  },
  city: {
    type: DataTypes.STRING,
  },
  district: {
    type: DataTypes.STRING,
  },
  patient_op: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  patient_opno: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  documenttype: {
    type: DataTypes.STRING,
  },
  patient_regdate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  patient_mobile: {
    type: DataTypes.STRING, // ✅ Changed from INTEGER to STRING
    allowNull: false,
  },
  whatsappnumber: {
    type: DataTypes.STRING,
  },
  emailid: {
    type: DataTypes.STRING,
  },
  trfno: {
    type: DataTypes.STRING, // ✅ Changed from INTEGER to STRING
  },
  remark: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  attatchfile: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  hospital_id: {
    type: DataTypes.INTEGER, // ✅ Ensure consistency with Hospital model
    allowNull: false,
    references: {
      model: Hospital,
      key: "hospital_id",
    },
  },
  created_by: {
    type: DataTypes.INTEGER, // ✅ Ensure consistency with User model
    allowNull: false,
    references: {
      model: User,
      key: "user_id",
    },
  },
});

// ✅ Corrected Associations
Patient.belongsTo(Hospital, { foreignKey: "hospital_id" });
Hospital.hasMany(Patient, { foreignKey: "hospital_id" });

Patient.belongsTo(User, { foreignKey: "created_by" });
User.hasMany(Patient, { foreignKey: "created_by" });

module.exports = Patient;
