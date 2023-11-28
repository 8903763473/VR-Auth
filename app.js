require('dotenv').config();
const express = require('express');
const cors = require('cors');
const register = require('../VR-Auth/api/authenticate/auth.router');
const app = express();

app.use((cors({
    origin: "*"
})));

app.use(express.json());
app.use("/api/auth", register);
app.listen(process.env.PORT, () => {
    console.log('Server is running on port :', process.env.PORT);
});