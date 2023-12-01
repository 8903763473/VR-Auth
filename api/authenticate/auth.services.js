const pool = require('../../config/database');
const bcrypt = require('bcrypt');


// const crypto = require('crypto');
// const randomstring = require('randomstring');
// const SECRET_KEY = randomstring.generate({ length: 32 });
// const IV_LENGTH = 16; 

// function encryptPassword(password) {
//     return new Promise((resolve, reject) => {
//         const iv = crypto.randomBytes(IV_LENGTH);
//         const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(SECRET_KEY), iv);

//         let encrypted = cipher.update(password, 'utf-8', 'hex');
//         encrypted += cipher.final('hex');
//         const result = { iv: iv.toString('hex'), encryptedPassword: encrypted };
//         resolve(result);
//     });
// }

// function decryptPassword(encryptedPassword,iv) {
//     return new Promise((resolve, reject) => {
//         const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(SECRET_KEY), Buffer.from(iv, 'hex'));
//         console.log('DECIPHER',decipher);
//         let decrypted = decipher.update(encryptedPassword, 'hex', 'utf-8');
//         console.log(decrypted);
//         decrypted += decipher.final('utf-8');
//         console.log('DECRYPTED PASS',decrypted);
//         resolve(decrypted);
//     });
// }

async function encryptPassword(password) {
    return new Promise((resolve, reject) => {
        const plainPassword = password
        const saltRounds = 10;
        const salt = bcrypt.genSaltSync(saltRounds);
        const hashedPassword = bcrypt.hashSync(plainPassword, salt);
        console.log('Hashed Password:', hashedPassword);
        // decryptPassword(hashedPassword, plainPassword)
        return resolve(hashedPassword)
    });
}

async function decryptPassword(hash, original) {
    return new Promise((resolve, reject) => {
        try {
            const passwordMatch = bcrypt.compareSync(original, hash);
            if (passwordMatch) {
                return resolve(passwordMatch)
            } else {
                return reject({ error: 'Incorrect Password' })
            }
        }
        catch (err) {
            return reject({ error: 'Incorrect Password' })
        }
    });
}

module.exports = {
    RegisterService: (data) => {
        return new Promise(async (resolve, reject) => {
            try {
                const EncryptedPassword = await encryptPassword(data.password);
                pool.query(
                    `INSERT INTO registerData (name, mail, password, mobile) VALUES (?, ?, ?, ?)`,
                    [
                        data.name,
                        data.mail,
                        EncryptedPassword,
                        data.mobile
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
                        return reject(error);
                    }
                    const Pass = await decryptPassword(result[0]?.password, data?.password)

                    if (result[0]?.mail === data?.mail) {
                        if (Pass == false) {
                            return reject({ error: 'Incorrect password' });
                        }
                    } else {
                        return reject({ error: 'User Not Found ,Please Register' });
                    }
                    return resolve(result)
                }
            )
        })
    },
    ForgetPasswordService: (data) => {
        console.log(data);
        return new Promise((resolve, reject) => {
            pool.query(
                `update registerData set password = ? where mail = ?`,
                [
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
    }
}