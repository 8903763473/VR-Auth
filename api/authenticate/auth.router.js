const { Register, getResisteredData, Login, sentOtp, otpVerify } = require('./auth.controller');
const { VerifyJWT } = require('../../jwtVerify/verify')
const router = require('express').Router();
router.post('/Register', Register);
router.get('/getRegisteredData', VerifyJWT, getResisteredData);
router.post('/login', Login);
router.put('/getOtp', sentOtp);
router.post('/verifyOtp', otpVerify)
module.exports = router;
