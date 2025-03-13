const cloudinary = require("../../config/cloudinary"); // Import Cloudinary config
const Patient = require("../../model/adminModel/registration/pppregistration"); // Import the model
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const express = require("express");
const { Op } = require("sequelize");
const Hospital=require('../../model/adminModel/masterModel/hospitalMaster');
const verifyToken=require("../../middlewares/authMiddileware");
const role=require("../../middlewares/roleMiddleware");

// Initialize Router
const router = express.Router();

// Configure Multer to Save Files Temporarily
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (!fs.existsSync("uploads")) {
      fs.mkdirSync("uploads"); // Create the directory if it doesn't exist
    }
    cb(null, "uploads/"); // Temporary folder
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + path.extname(file.originalname);
    cb(null, uniqueName); // Unique file name
  },
});

const upload = multer({ storage: storage });

/// Add Patient Details

router.post(
  "/add-patient",
  verifyToken,
  role("phlebotomist"),
  upload.single("image"),
  async (req, res) => {
    try {
      // Extract user details from token
      const { id: user_id, hospital_id } = req.user;
      if (!hospital_id) {
        return res.status(400).json({ message: "Hospital ID is missing in token" });
      }

      

      // Ensure hospital exists
      const hospital = await Hospital.findOne({ where: { hospital_id } }); 
      if (!hospital) {
        return res.status(404).json({ message: "Invalid hospital" });
      }

      const {
        patient_name,
        gurdian_name,
        patient_age,
        patient_gender,
        patient_barcode,
        refdoc,
        document,
        area,
        city,
        district,
        patient_op,
        patient_opno,
        patient_regdate,
        patient_mobile,
        whatsappnumber,
        emailid,
        trfno,
        remark,
      } = req.body;

      // File path from Multer (check if file exists)
    const filePath = req.file.path;

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(filePath, {
      folder: "trf", // Folder name in Cloudinary
    });

    // Delete Local File After Upload
    fs.unlinkSync(filePath);

      // Create Patient Registration
      const createPatient = await Patient.create({
        patient_name,
        gurdian_name,
        patient_age,
        patient_gender,
        patient_barcode,
        refdoc,
        document,
        area,
        city,
        district,
        patient_op,
        patient_opno,
        patient_regdate,
        patient_mobile,
        whatsappnumber,
        emailid,
        trfno,
        remark,
        attatchfile: result.secure_url, 
        hospital_id,  
        created_by: user_id, 
      });

      // Send response with hospital name
      res.status(201).json({
        message: "Patient registered successfully!",
        data: createPatient,
        hospital_name: hospital.hospital_name, 
      });

    } catch (error) {
      res.status(500).json({
        message: "Patient registration failed",
        error: error.message, 
      });
    }
  }
);



// Get Patient Details by Hospital
router.get("/get-patient/:hospital_name",verifyToken,role("reception","phlebotomist"), async (req, res) => {
  try {
    /// Get Extract URL of hospital
    const { hospital_name } = req.params;
    // Get current date in 'YYYY-MM-DD' format
    const currentDate = new Date().toLocaleDateString("en-CA");
    
    const hospital = await Hospital.findOne({ where: { hospital_name } });
    if (!hospital) {
      return res.status(404).json({ message: 'Hospital not found' });
    } 
    ///Get all Patients details by Hospital Name and Current Date  
    const fetchPatients = await Patient.findAll({
        where: { patient_regdate: currentDate,hospital_id: hospital.hospital_id},
        include: [
          { model: Hospital,attributes: ['hospital_name'] }
        ]
      });

    /// Checks if there is no data according to that hospital name
    if (fetchPatients.length === 0) {
      return res
        .status(200)
        .json({ message: "No data available" });
    }

    res.status(200).json({data: fetchPatients, hospital_name: hospital.hospital_name});
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
});

// /// Get Search PPP Patients details by barcode, date and name
// router.get("/get-search", async (req, res) => {
//   try {
//     ///Get Barcode and Date for Search PPP Data
//     const { barcode, startDate, endDate,patientname } = req.query;

//     const barcodeInt=parseInt(barcode, 10);
//     const whereConditions={};

//     /// Search By Barcode
//     if (barcode) {
//       whereConditions.barcode = {
//        barcodeInt // Assuming barcode is an integer
//       };
//     }

//     ///Search Name
//     if (patientname) {
//       whereConditions.patientname = {
//        patientname 
//       };
//     }


//   // Add date range condition if both dates are provided
//   if (startDate && endDate) {
//     whereConditions.regdate = {
//         [Op.between]: [
//             new Date(startDate + 'T00:00:00Z'),
//             new Date(endDate + 'T23:59:59Z')
//         ]
//     };
// }
//     const fetchPPP = await Patient.findAll({where:whereConditions});

//         /// Checks if there is no data according to that hospital name
//         if (!fetchPPP || fetchPPP.length === 0) {
//           return res
//             .status(404)
//             .json({ message: "No data found" });
//         }
//          // Return results
//         return res.status(200).json({
//             success: true,
//             count: fetchPPP.length,
//             data: fetchPPP
//         });
//   } catch (error) {
//     res
//     .status(500)
//     .json({ message: "Something went wrong", error: error.message });
//   }
// });

// /// Update PPP Details
// router.put('/update-ppp/:id',upload.single('attatchfile'),async (req,res) => {
  
//   try {
//     const id=req.params.id;
//      const updateData = {
//               ...req.body,
//               attatchfile: req.file ? req.file.path : undefined
//           };

//           const [updateCount] = await Patient.update(updateData, {
//             where: { id: id }
//         });
  
//         if (updateCount === 0) {
//             return res.status(404).json({
//                 success: false,
//                 message: 'Record not found'
//             });
//         }
//     const updatePPP=await Patient.findByPk(id);
//     return res.status(200).json({
//       success: true,
//       message: 'Updated successfully',
//       data: updatePPP
//   });
//   } catch (error) {
//     res
//     .status(500)
//     .json({ message: "Something went wrong", error: error.message });
//   }
// });




module.exports = router;
