const cloudinary = require("../../../config/cloudinary"); // Import Cloudinary config
const PPPRegistration = require("../../../model/adminModel/registration/pppregistration"); // Import the model
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const express = require("express");
const { Op } = require("sequelize");

const Hospital=require('../../../model/adminModel/masterModel/hospitalMaster');

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

/// Add PPP Details

router.post("/add-ppp", upload.single("image"), async (req, res) => {
  try {

    const {
      patientname,
      gurdianname,
      age,
      gender,
      barcode,
      refdoc,
      document,
      area,
      city,
      district,
      op,
      opno,
      documenttype,
      regdate,
      mobilenumber,
      whatsappnumber,
      emailid,
      trfno,
      remark,
      hospital_code
    } = req.body;
    const filePath = req.file.path;

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(filePath, {
      folder: "trf", // Folder name in Cloudinary
    });

    // Delete Local File After Upload
    fs.unlinkSync(filePath);

    const hospital = await Hospital.findOne({ where: { hsptlname: hospital_code } });
    if (!hospital) {
      return res.status(404).json({ message: 'Hospital not found' });
    }

    const newPPP = await PPPRegistration.create({
      patientname,
      gurdianname,
      age,
      gender,
      barcode,
      refdoc,
      hospital,
      document,
      area,
      city,
      district,
      op,
      opno,
      documenttype,
      regdate,
      mobilenumber,
      whatsappnumber,
      emailid,
      trfno,
      remark,
      hospital_id: hospital.id,
      attatchfile: result.secure_url,
    });

    // Response
    res.status(201).json({
      message: "PPP registered successfully!",
      data: newPPP,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
});

/// Get PPP Details by Hospital
router.get("/get-ppp/:hospital_code", async (req, res) => {
  try {
    /// Get Extract URL of hospital
    const { hospital_code } = req.params;
    // Get current date in 'YYYY-MM-DD' format
    const currentDate = new Date().toLocaleDateString("en-CA");
    const hospital = await Hospital.findOne({ where: { hsptlname: hospital_code } });
    if (!hospital) {
      return res.status(404).json({ message: 'Hospital not found' });
    }
    ///Using Select Clause get PPP details by Hospital Name and current date with 10 data limit

    const fetchPPP = await PPPRegistration.findAll({
      where: { hospital_id: hospital.id } });

    /// Checks if there is no data according to that hospital name
    if (fetchPPP.count === 0) {
      return res
        .status(404)
        .json({ message: "No data found for the specified hospital name" });
    }

    res.status(200).json(fetchPPP);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
});

/// Get Search PPP Patients details by barcode and date
router.get("/get-search", async (req, res) => {
  try {
    ///Get Barcode and Date for Search PPP Data
    const { barcode, startDate, endDate } = req.query;

    const barcodeInt=parseInt(barcode, 10);
    const whereConditions={};

    if (barcode) {
      whereConditions.barcode = {
       barcodeInt // Assuming barcode is an integer
      };
    }


  // Add date range condition if both dates are provided
  if (startDate && endDate) {
    whereConditions.regdate = {
        [Op.between]: [
            new Date(startDate + 'T00:00:00Z'),
            new Date(endDate + 'T23:59:59Z')
        ]
    };
}
    const fetchPPP = await PPPRegistration.findAll({where:whereConditions});

        /// Checks if there is no data according to that hospital name
        if (!fetchPPP || fetchPPP.length === 0) {
          return res
            .status(404)
            .json({ message: "No data found" });
        }
         // Return results
        return res.status(200).json({
            success: true,
            count: fetchPPP.length,
            data: fetchPPP
        });
  } catch (error) {
    res
    .status(500)
    .json({ message: "Something went wrong", error: error.message });
  }
});

/// Update PPP Details
router.put('/update-ppp/:id',upload.single('attatchfile'),async (req,res) => {
  
  try {
    const id=req.params.id;
     const updateData = {
              ...req.body,
              attatchfile: req.file ? req.file.path : undefined
          };

          const [updateCount] = await PPPRegistration.update(updateData, {
            where: { id: id }
        });
  
        if (updateCount === 0) {
            return res.status(404).json({
                success: false,
                message: 'Record not found'
            });
        }
    const updatePPP=await PPPRegistration.findByPk(id);
    return res.status(200).json({
      success: true,
      message: 'Updated successfully',
      data: updatePPP
  });
  } catch (error) {
    res
    .status(500)
    .json({ message: "Something went wrong", error: error.message });
  }
});




module.exports = router;
