const { Register, getResisteredData, Login, ForgetPassword, sentOtp, otpVerify } = require('./auth.controller');
const router = require('express').Router();
router.post('/Register', Register);
router.get('/getRegisteredData', getResisteredData);
router.post('/login', Login);
router.put('/forgetPassword', ForgetPassword);
router.put('/getOtp', sentOtp);
router.post('/verifyOtp', otpVerify)
module.exports = router;
