const { createPool } = require('mysql2');

const pool = createPool({
    port: process.env.DB_PORT,
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

pool.getConnection(function (err) {
    if (err) throw err;
    console.log('Connected Successfully')
    pool.query(
        `CREATE TABLE IF NOT EXISTS registerData (id int primary key auto_increment,userId varchar(20),name varchar(25),mail varchar(30),mobile char(10) NOT NULL UNIQUE,otp varchar(100),password varchar(100),forgetPass varchar(100),image longblob)`,
        function (err) {
            if (err) {
                console.error('Error creating registerData table:', err);
            } else {
                console.log('registerData Table Created');
            }
        }
    )
})


module.exports = pool;