const { RegisterService, getResisteredDataService} = require('./auth.services')


module.exports = {
    Register: async (req, res) => {
        try {
            const body = req.body;
            const result = await RegisterService(body);
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
        try{
            const body = req.body;
            // const result = await LoginService(body);
            // const result1 = await RegisterService(body);
        }
        catch(err){
            console.log(err);
        }
    }
}