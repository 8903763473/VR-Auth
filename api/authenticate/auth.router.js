const { Register, getResisteredData, Login, sentOtp, otpVerify } = require('./auth.controller');
const { VerifyJWT } = require('../../jwtVerify/verify');
const { sentMsg, receiveMsg, NetworkStatus, OnlineUsers } = require('../../api/chat/chat.controller');

const router = require('express').Router();

// ************** Login / Register **************

router.post('/Register', Register);
router.post('/login', Login);
router.post('/verifyOtp', otpVerify);
router.get('/getRegisteredData', VerifyJWT, getResisteredData);
router.put('/getOtp', sentOtp);

// ************** Message ***********************

router.post('/sent', sentMsg);
router.post('/receive', receiveMsg);
router.post('/NetworkStatus', NetworkStatus);
router.get('/online-users', OnlineUsers);


module.exports = router;
