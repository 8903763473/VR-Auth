const { Register, getResisteredData, Login, sentOtp, otpVerify } = require('./auth.controller');
const { VerifyJWT } = require('../../jwtVerify/verify');
const { sentMsg, receiveMsg, NetworkStatus, OnlineUsers } = require('../../api/chat/chat.controller');

const router = require('express').Router();

// ************** Login / Register **************

router.post('/Register', Register);
router.get('/getRegisteredData', VerifyJWT, getResisteredData);
router.post('/login', Login);
router.put('/getOtp', sentOtp);
router.post('/verifyOtp', otpVerify);

// ************** Message ***********************

router.post('/sent', sentMsg);
router.post('/receive', receiveMsg);
router.post('/NetworkStatus', NetworkStatus);
router.get('/online-users', OnlineUsers);


module.exports = router;
