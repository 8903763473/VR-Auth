const { Register, getResisteredData } = require('./auth.controller');
const router = require('express').Router();
router.post('/Register', Register);
router.get('/getRegisteredData', getResisteredData)
module.exports = router;
