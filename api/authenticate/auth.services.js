const pool = require('../../config/database');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const otpGenerator = require('otp-generator');
const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');


async function encryptPassword(password) {
    return new Promise((resolve, reject) => {
        const plainPassword = password
        const saltRounds = 10;
        const salt = bcrypt.genSaltSync(saltRounds);
        const hashedPassword = bcrypt.hashSync(plainPassword, salt);
        console.log('Hashed Password:', hashedPassword);
        return resolve(hashedPassword)
    });
}

async function decryptPassword(hash, original) {
    return new Promise((resolve, reject) => {
        const passwordMatch = bcrypt.compare(original, hash);
        if (passwordMatch === false) {
            return reject({ error: 'Incorrect Password' })
        } else {
            return resolve(passwordMatch)
        }
    });
}

async function generateUniqueId() {
    // const randomPart = crypto.randomBytes(2).toString('hex');
    // const uniqueId = "VR-" + randomPart;
    // console.log('uniqueId', uniqueId);
    // return uniqueId;

    const ID = uuidv4();
    const min = Math.pow(10, 1 - 1);
    const max = Math.pow(10, 1) - 1;
    const UID = ID?.substring(0, 3) + "-" + Math.floor(Math.random() * (max - min + 1)) + min;
    return ("VR-" + UID);
}

async function generateNumericOTP(length) {
    const digits = '0123456789';
    let otp = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * digits.length);
        otp += digits[randomIndex];
    }
    return otp;
}

async function sentEmail(mail) {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'mugeshthedeveloper@gmail.com',
                pass: 'ccwihtzenkjxyvrs',
            },
        });

        const otp = await generateNumericOTP(6);

        const mailOptions = {
            from: 'mugeshwaran27@gmail.com',
            to: mail,
            subject: 'OTP From Vijay',
            text: `Your OTP is: ${otp}`,
        };
        console.log('mailOptions', mailOptions);

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
        return otp;
    } catch (error) {
        throw new Error("Error in sending OTP Email");
    }
}

async function setPassword(data) {
    return new Promise(async (resolve, reject) => {
        const EncryptedPassword = await encryptPassword(data.forgetPass);
        pool.query(
            `update registerData set password = ? where mail = ?`,
            [
                EncryptedPassword,
                data.mail
            ],
            (error, result) => {
                if (error) {
                    return reject(error);
                }
                return resolve(result);
            }
        );
    });
}

module.exports = {
    RegisterService: (data) => {
        return new Promise(async (resolve, reject) => {
            try {
                const EncryptedPassword = await encryptPassword(data.password);
                const UserId = await generateUniqueId()
                console.log('UID', UserId);
                pool.query(
                    `INSERT INTO registerData (name, mail, password, mobile , userId) VALUES (?, ?, ?, ? , ?)`,
                    [
                        data.name,
                        data.mail,
                        EncryptedPassword,
                        data.mobile,
                        UserId
                    ],
                    (error, result) => {
                        if (error) {
                            return reject(error);
                        }
                        return resolve(result);
                    }
                );
            }
            catch (error) {
                reject(error)
            }
        });
    },
    getResisteredDataService: () => {
        return new Promise((resolve, reject) => {
            pool.query(
                `select * from registerData`,
                [],
                (error, result) => {
                    if (error) {
                        return reject(error);
                    }
                    return resolve(result)
                }
            )
        })
    },
    LoginService: (data) => {
        return new Promise((resolve, reject) => {
            pool.query(
                `select * from registerData where mail=?`,
                [data.mail],
                async (error, result) => {
                    if (error) {
                        return reject({ error: error });
                    }
                    if (result[0]?.mail == data?.mail) {
                        const Pass = await decryptPassword(result[0]?.password, data?.password);
                        if (Pass == false) {
                            return reject({ error: 'Incorrect password' });
                        }
                    } else {
                        console.log('MAIL NOT MATCHED');
                        return reject({ error: 'User Not Found ,Please Register' });
                    }
                    return resolve(result)
                }
            )
        })
    },
    SentOTPService: async (data) => {
        return new Promise(async (resolve, reject) => {
            const generatedOTP = await sentEmail(data.mail);
            pool.query(
                `update registerData set otp = ? , forgetPass = ? where mail = ?`,
                [
                    generatedOTP,
                    data.confirmPassword,
                    data.mail
                ],
                (error, result) => {
                    if (error) {
                        return reject(error);
                    }
                    console.log('Ramya', result);
                    return resolve(result)
                }
            )
        })
    },
    otpVerifyService: async (data) => {
        return new Promise((resolve, reject) => {
            pool.query(
                `select * from registerData where mail = ?`,
                [data.mail],
                async (error, result) => {
                    if (error) {
                        return reject(error);
                    }
                    console.log('RES >>>', result);
                    const OTP = await decryptPassword(result[0]?.otp, data.otp)

                    if (OTP == false) {
                        if (result[0].otp != data?.otp) {
                            return reject({ error: 'Wrong OTP' });
                        } else {
                            await setPassword(result[0])
                        }
                    } else {
                        return reject({ error: 'User Not Found ,Please Register' });
                    }
                    return resolve(result)
                }
            )
        })
    },
}