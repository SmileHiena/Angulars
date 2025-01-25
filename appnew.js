const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017'; // Thay đổi URL kết nối nếu cần
const dbName = 'book'; // Thay 'your_database_name' bằng tên cơ sở dữ liệu của bạn

const data = {
    "books": [
        {
            "id": 1,
            "img": "pr-cam.jpg",
            "name": "Cam sành",
            "description": "Cam sành là loại trái cây mọng nước, ngon ngọt, giàu vitamin, rất tốt cho sức khỏe và được nhiều người yêu thích. Cam sành có vỏ màu xanh và chuyển vàng khi chín, vỏ sần và dày, tép màu vàng cam đậm, mọng nước, vị ngọt chua và khá nhiều hạt. Thường được sử dụng để vắt lấy nước uống. Đảm bảo nguồn gốc cam được trồng tại các tỉnh như Tiền Giang, Vĩnh Long,... tuỳ theo mùa vụ",
            "price": 19000,
            "categoryId": 2,
            "bestseller": 1
        }
    ],
    "categories": [
       
    ],
    "users": [
        {
            "id": 2,
            "email": "teo@gmail.com",
            "password": "$2b$10$VHhXWoCubXIScZpyFekVdOdBqtLQVZaTbWcfU7SZ3o22NMWWicA7i",
            "fullname": "Nguyễn văn Tèo",
            "isAdmin": 1,
            "img": "teo.jpeg"
        },
        {
            "id": 3,
            "email": "admin@gmail.com",
            "password": "$2b$10$DX1V\/NUQLCKYyNua9JxE0uusxf8H2iTbwvGpERSbrUYdQIX97Ygbq",
            "fullname": "admin",
            "isAdmin": 0,
            "img": "admin.jpeg"
        }
    ]
};

async function main() {
    const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });

    try {
        await client.connect();
        const db = client.db(dbName);

        await insertData(db, 'products', data.books);
        await insertData(db, 'categories', data.categories);
        await insertData(db, 'users', data.users);
    } catch (err) {
        console.error(err);
    } finally {
        client.close();
    }
}

async function insertData(db, collectionName, data) {
    const collection = db.collection(collectionName);
    await collection.insertMany(data);
}

main();
