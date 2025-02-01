const Router=require('express');
const { registration, login, verifyOtp, resendOtp } = require('../../controller/authenticationController/authenticationController');
const router=Router();

/// Authentication Routes
router.route("/signup").post(registration);
router.route("/signin").post(login);
router.route("/verifyotp").post(verifyOtp);
router.route("/resendotp/:userid").post(resendOtp);

module.exports=router;