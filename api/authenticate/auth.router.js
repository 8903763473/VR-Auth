const { Register, getResisteredData } = require('./auth.controller');
const router = require('express').Router();
router.post('/Register', Register);
router.get('/getRegisteredData', getResisteredData)
router.get('/login', getResisteredData)
module.exports = router;
