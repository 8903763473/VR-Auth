const { Register, getResisteredData, Login, ForgetPassword } = require('./auth.controller');
const router = require('express').Router();
router.post('/Register', Register);
router.get('/getRegisteredData', getResisteredData)
router.post('/login', Login)
router.put('/forgetPassword', ForgetPassword)
module.exports = router;
