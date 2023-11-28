const pool = require('../../config/database')

module.exports = {
    RegisterService: (data) => {
        return new Promise((resolve, reject) => {
            pool.query(
                `insert into registerData (name,mail,password,mobile) values (?,?,?,?)`,
                [
                    data.name,
                    data.mail,
                    data.password,
                    data.mobile
                ],
                (error, result) => {
                    if (error) {
                        return reject(error);
                    }
                    return resolve(result)
                }
            )
        })
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
    
}