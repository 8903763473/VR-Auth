const { Register, getResisteredData, Login, sentOtp, otpVerify } = require('./auth.controller');
const { VerifyJWT } = require('../../jwtVerify/verify');

const { sentMsg, receiveMsg,updateStatus,OnlineUsers } = require('../../api/chat/chat.controller');

const router = require('express').Router();

router.post('/Register', Register);
router.get('/getRegisteredData', VerifyJWT, getResisteredData);
router.post('/login', Login);
router.put('/getOtp', sentOtp);
router.post('/verifyOtp', otpVerify)

router.post('/sent', sentMsg)
router.post('/receive', receiveMsg)
router.post('/update-status', updateStatus)
router.get('/online-users', OnlineUsers)


module.exports = router;
