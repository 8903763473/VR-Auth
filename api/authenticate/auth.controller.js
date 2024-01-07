const { RegisterService, getResisteredDataService, otpVerifyService, LoginService, SentOTPService, getjwtToken } = require('./auth.services')


module.exports = {
    Register: async (req, res) => {
        try {
            const body = req.body;
            console.log(body);
            const result = await RegisterService(body);
            if (!result.affectedRows) {
                throw new Error('Failed! Insert record');
            };
            return res.status(200).json([
                body
            ]);
        }
        catch (err) {
            res?.status(500).json({ error: 'Internal Server Error' });
        }
    },
    getResisteredData: async (req, res) => {
        try {
            const results = await getResisteredDataService();
            const arr = [];
            for (var i = 0; i < results.length; i++) {
                const imageBuffer = "" + Buffer.from(results[i]?.image);
                arr.push({ "id": results[i].id, "userId": results[i].userId, "name": results[i].name, "image": imageBuffer, "mail": results[i].mail, "password": results[i].password, "mobile": results[i].mobile });
            }
            console.log('RegisteredUsers', arr);
            return res?.status(200).json(
                arr
            )
        }
        catch (err) {
            res?.status(500).json({ error: 'Internal Server Error' });
        }
    },
    Login: async (req, res, next) => {
        try {
            const body = req.body;
            const results = await LoginService(body);
            if (results?.length === 0) {
                return res.status(404).json({ error: 'User Not Found ,Please Register' });
            }
            const jwtToken = await getjwtToken(results[0].userId);
            results[0].token = jwtToken

            return res.status(200).json(
                results
            )
        }
        catch (err) {
            return res.status(404).json(err);
        }
    },
    sentOtp: async (req, res, next) => {
        try {
            const body = req.body;
            const results = await SentOTPService(body);
            if (!results.affectedRows) {
                throw new Error('Failed! Insert record');
            };
            return res.status(200).json(
                body
            )
        }
        catch (err) {
            return res.status(404).json(err);
        }
    },
    otpVerify: async (req, res, next) => {
        try {
            const body = req.body;
            const results = await otpVerifyService(body);
            // if (!results.affectedRows) {
            //     throw new Error('Failed! Insert record');
            // };
            return res.status(200).json(
                results
            )
        }
        catch (err) {
            return res.status(404).json(err);
        }
    },
}