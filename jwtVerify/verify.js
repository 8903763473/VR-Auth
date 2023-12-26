const jwt = require('jsonwebtoken');
const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

const VerifyJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ error: "Please login to continue." });
    }

    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: "Please login to continue." });
        } else {
            if (decoded.userId !== null && decoded.userId !== undefined) {
                pool.query(
                    `select * from registerData where userId = ?`,
                    [decoded.userId],
                    (error, results) => {
                        if (error) {
                            return res.status(500).json({ error: "Internal server error." });
                        }
                        const data = results[0];
                        if (data.userId === decoded.userId) {
                            next();
                        } else {
                            return res.status(403).json({ error: "Unauthorized access." });
                        }
                    }
                );
            } else {
                return res.status(403).json({ error: "Unauthorized access." });
            }
        }
    });
};

module.exports = { VerifyJWT };
