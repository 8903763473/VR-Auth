const { RegisterService, getResisteredDataService, otpVerifyService, LoginService, ForgetPasswordService, SentOTPService } = require('./auth.services')


module.exports = {
    Register: async (req, res) => {
        try {
            const body = req.body;
            const result = await RegisterService(body);
            console.log(result);
            if (!result.affectedRows) {
                throw new Error('Failed! Insert record');
            };
            return res.status(200).json([
                body
            ]);
        }
        catch (err) {
            console.log(err);
        }
    },
    getResisteredData: async (req, res) => {
        try {
            const results = await getResisteredDataService();
            const arr = [];
            for (var i = 0; i < results.length; i++) {
                arr.push({ "id": results[i].id, "name": results[i].name, "mail": results[i].mail, "password": results[i].password, "mobile": results[i].mobile });
            }
            return res.json(
                arr
            )
        }
        catch (err) {
            console.log(err);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },
    Login: async (req, res, next) => {
        try {
            const body = req.body;
            console.log('body', body);
            const results = await LoginService(body);
            console.log('results', results);
            if (results?.length === 0) {
                return res.status(404).json({ error: 'User Not Found ,Please Register' });
            }

            return res.status(200).json(
                results
            )
        }
        catch (err) {
            console.log(err);
            return res.status(404).json(err);
        }
    },
    // ForgetPassword: async (req, res, next) => {
    //     try {
    //         const body = req.body;
    //         const results = await ForgetPasswordService(body);
    //         console.log('RESULTS', results);
    //         // if (!results.affectedRows) {
    //         //     throw new Error('Failed! Insert record');
    //         // };
    //         return res.status(200).json(
    //             results
    //         )
    //     }
    //     catch (err) {
    //         console.log(err);
    //         return res.status(404).json(err);
    //     }
    // },
    sentOtp: async (req, res, next) => {
        try {
            const body = req.body;
            console.log('request', req.body);
            const results = await SentOTPService(body);
            console.log(results);
            if (!results.affectedRows) {
                throw new Error('Failed! Insert record');
            };
            return res.status(200).json(
                body
            )
        }
        catch (err) {
            console.log(err);
            return res.status(404).json(err);
        }
    },
    otpVerify: async (req, res, next) => {
        try {
            const body = req.body;
            console.log('req', req.body);
            const results = await otpVerifyService(body);
            console.log('RES', results);
            // if (!results.affectedRows) {
            //     throw new Error('Failed! Insert record');
            // };
            return res.status(200).json(
                results
            )
        }
        catch (err) {
            console.log(err);
            return res.status(404).json(err);
        }
    },
}