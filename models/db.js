const { MongoClient
} = require('mongodb');
// khai báo url
const url = "mongodb://localhost:27017";
// tên database
const dbName = 'User';
// hàm kết nối
async function connectDb() {
    const client = new MongoClient(url);
    await client.connect();
    console.log('Kết nối thành công đến server');
    return client.db(dbName);
}
module.exports = connectDb;