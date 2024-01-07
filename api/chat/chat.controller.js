const { initializeApp } = require('firebase/app');
const admin = require('firebase-admin');
const { getDatabase, ref, push, onValue, set, serverTimestamp } = require('firebase/database');

const serviceAccount = require('../../firebaseConfig.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://vr-auth-default-rtdb.firebaseio.com",
});

const presenceRef = admin.database().ref('onlineUsers');

const firebaseConfig = {
    apiKey: "AIzaSyBOjBYpsLRYXcuL2YppAzHf-erRNawB7KM",
    authDomain: "vr-auth.firebaseapp.com",
    databaseURL: "https://vr-auth-default-rtdb.firebaseio.com",
    projectId: "vr-auth",
    storageBucket: "vr-auth.appspot.com",
    messagingSenderId: "950313858348",
    appId: "1:950313858348:web:f2acb17430499a6fe02889",
    measurementId: "G-VL7QYN0EZC"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
console.log('Connected to Firebase Realtime Database successfully.');


async function modifyChat(allData) {
    console.log('allData', allData);
    return new Promise((resolve, reject) => {
        const date = new Date(allData?.timestamp);
        let hours = date.getHours();
        const amPm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12;
        const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
        const formattedtime = `${hours.toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')} ${amPm}`;
        const chat = []
        chat.push({ "receiverId": allData?.receiver, "senderId": allData?.senderId, "message": allData?.message, "time": formattedtime, "date": formattedDate });
        return resolve(chat)
    });
}



module.exports = {
    sentMsg: async (req, res) => {
        try {
            const body = req.body;
            console.log(body);
            const chatRef = ref(database, `chats/${body.userId}`);
            const newMessageRef = push(chatRef);

            set(newMessageRef, {
                message: body.message,
                receiver: body.receiverId,
                senderId: body.userId,
                timestamp: serverTimestamp()
            });

            res?.status(200).json({ message: 'Message sent Successfully' });
        } catch (err) {
            console.error(err);
            res?.status(500).json({ error: 'Internal Server Error' });
        }
    },
    receiveMsg: async (req, res) => {
        try {
            const body = req.body;
            const chatRef = ref(database, `chats/${body.userId}`);
            const chatHistory = [];
            const snapshotCallback = async (snapshot) => {
                const messages = snapshot.val();
                if (messages === null) {
                    return res?.status(404).json({ error: 'No messages here' });
                }
                for (const messageId in messages) {
                    const CorrectData = await modifyChat(messages[messageId]);
                    chatHistory.push(CorrectData[0]);
                }
                res?.status(200).json(chatHistory);
            };
    
            onValue(chatRef, snapshotCallback, { onlyOnce: true });
        } catch (err) {
            console.error(err);
            res?.status(500).json({ error: 'Internal Server Error' });
        }
    },    
    NetworkStatus: async (req, res) => {
        try {
            const { userId, status } = req.body;

            if (!userId) {
                return res.status(400).json({ error: 'Invalid userId' });
            }

            if (status === 'offline') {
                await presenceRef.child(userId).remove();
                res.status(200).json({ success: true });
            } else if (status === 'online') {
                presenceRef.child(userId).set(status, (error) => {
                    if (error) {
                        console.error(error);
                        return res.status(500).json({ error: 'Internal Server Error' });
                    }
                    res.status(200).json({ success: true });
                });
            } else {
                res.status(400).json({ error: 'Invalid status' });
            }
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    OnlineUsers: async (req, res) => {
        try {
            const snapshot = await presenceRef.orderByValue().equalTo('online').once('value');
            const onlineUsers = snapshot.val() || {};
            const onlineUsersArray = Object.keys(onlineUsers).map(userId => ({
                id: userId
            }));
            return res.status(200).json(onlineUsersArray);
        } catch (error) {
            console.error('Error fetching online users:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },
};

