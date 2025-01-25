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
        },
        {
            "id": 2,
            "img": "pr-dualuoi.jpg",
            "name": "Dưa lưới",
            "description": "Dưa lưới tròn ruột cam là loại trái cây giải nhiệt, thanh mát với vị ngọt và nhiều nước. Dưa lưới có đặc điểm dáng tròn, vỏ màu xanh khá dày với nhiều đường vân nổi gồ, thô ráp.Dưa lưới được trồng tại Bình Thuận ",
            "price": 70000,
            "categoryId": 2,
            "bestseller": 0
        },
        {
            "id": 3,
            "img": "pr-nho.jpg",
            "name": "Nho xanh",
            "description": "Nho xanh Ninh Thuận là trái cây có xuất xứ từ tỉnh Ninh Thuận. Nho xanh này là loại nho có hạt, vỏ ngoài màu xanh có vết nám tự nhiên, được yêu thích nhờ vị chua ngọt, giòn và mọng nước. Mỗi hộp nho được đóng hộp nhựa chắc chắn, đảm bảo nho không bị dập, úng",
            "price": 70000,
            "categoryId": 2,
            "bestseller": 1
        },
        {
            "id": 4,
            "img": "pr-tao.jpeg",
            "name": "Táo Autumn Glory",
            "description": "Táo Autumn Glory mini là trái cây nhập khẩu Mỹ, chất lượng an toàn cùng lượng dưỡng chất dồi dào, có vị giòn ngọt và thanh mát. Ngoài ra, nhiều nghiên cứu cho rằng ăn 2 quả táo mỗi ngày có thể giảm nguy cơ đột quỵ hoặc đau tim nếu nguyên nhân xuất phát từ cholesterol làm cứng động mạch.",
            "price": 55000,
            "categoryId": 2,
            "bestseller": 0
        },
        {
            "id": 5,
            "img": "pr-le.jpeg",
            "name": "Lê Tai Nung",
            "description": "Lê Tai Nung nhập khẩu từ Trung Quốc, với vỏ mỏng, xanh và thịt trắng. Lê Tai Nung là có đặc điểm quả nhỏ, núm ở cuống hơi lõm, thịt trắng, đặc ruột, mọng nước chứa nhiều vitamin C, canxi và sắt. Khi chín có vị ngọt thanh có tác dụng bổ sung chất dinh dưỡng cho cơ thể và phù hợp làm trái cây giải nhiệt.",
            "price": 40500,
            "categoryId": 2,
            "bestseller": 1
        },
        {
            "id": 6,
            "img": "pr-oi.jpg",
            "name": "Ổi Ruby",
            "description": "Ổi ruby là loại trái cây chất lượng, thơm ngon có lớp vỏ màu xanh lá cây bóng mượt, bên trong có màu đỏ hồng rất bắt mắt và hấp dẫn. Ổi ruby được rất nhiều người ưa chuộng và chọn mua bởi sự giòn, ngọt của nó.",
            "price": 27000,
            "categoryId": 2,
            "bestseller": 0
        },
        {
            "id": 7,
            "img": "pr-bido.jpg",
            "name": "Bí đỏ hồ lô ",
            "description": "Bí đỏ hồ lô hay bí đỏ hạt đậu, đây là giống bí có ruột rất đặc, ít hạt ăn dẻo và ngọt. Bí hồ lô chứa nhiều chất dinh dưỡng và mang lại nhiều lợi ích cho sức khoẻ. Bí hồ lô có thể chế biến thành nhiều món ăn ngon như: sữa bí, canh bí, súp bí,... món nào cũng đều thơm ngon.",
            "price": 10000,
            "categoryId": 1,
            "bestseller": 1
        },
        {
            "id": 8,
            "img": "pr-bau.jpg",
            "name": "Bầu sao trái",
            "description": "Bầu sao là một loại quả có thể biến thành các món ăn ngon cho gia đình. Trái bầu thon dài, bề mặt có ít lông tơ, vỏ màu xanh tươi. Bầu có thể chế biến thành các món ăn như luộc, xào, nấu canh đều rất ngon.",
            "price": 30000,
            "categoryId": 1,
            "bestseller": 0
        },
        {
            "id": 9,
            "img": "pr-bapcai.jpg",
            "name": "Bắp cải trắng",
            "description": "Bắp cải trắng có độ giòn và vị ngon đặc trưng, lá càng vào trong phần lỗi càng non, giòn, để lại hậu ngọt khi ăn. Vì thế không chỉ dùng để chế biến chín, bắp cải trắng còn phù hợp ăn sống, làm nhiều món salad tươi, giòn, thanh mát.",
            "price": 20000,
            "categoryId": 1,
            "bestseller": 1
        },
        {
            "id": 10,
            "img": "pr-cachua.jpg",
            "name": "Cà chua bi",
            "description": "Cà chua bi được trồng ở Lâm Đồng là loại thực phẩm dinh dưỡng, tốt cho sức khỏe được nhiều người chọn lựa. Cà chua bi to trái, căng mọng có thể dùng ăn chơi hoặc là nguyên liệu cho những món ăn ngon khác. Cà chua bi giúp đẹp da, sáng mắt là thực phẩm nên sử dụng thường xuyên.",
            "price": 66000,
            "categoryId": 1,
            "bestseller": 0
        },
        {
            "id": 11,
            "img": "pr-khoailang.jpg",
            "name": "Khoai lang mật",
            "description": "Khoai lang mật được trồng và có củ quanh năm, ngon nhất là khi được nướng lên trên một bếp than đổ hồng. Loại củ này có vị ngọt ngào như mật, khi cho vào miệng thì bở tơi, tan tan trên đầu lưỡi thì còn gì bằng. Khoai lang Nhật chứa nhiều vitamin A, B, C và nhiều khoáng chất cần thiết cho làn da đẹp.",
            "price": 31000,
            "categoryId": 1,
            "bestseller": 1
        },
        {
            "id": 12,
            "img": "pr-carot.jpg",
            "name": "Cà rốt ",
            "description": "Cà rốt là một loại củ rất quen thuộc trong các món ăn của người Việt. Cà rốt có hàm lượng chất dinh dưỡng và vitamin A cao, được xem là nguyên liệu cần thiết cho các món ăn dặm của trẻ nhỏ, giúp trẻ sáng mắt và cung cấp nguồn chất xơ dồi dào.",
            "price": 12000,
            "categoryId": 1,
            "bestseller": 0
        },
        {
            "id": 13,
            "img": "pr-cusan.jpg",
            "name": "Củ sắn",
            "description": "Củ sắn hay củ đậu là một loại củ khá ngọt, nhiều nước và rất giòn, chứa nhiều khoáng chất như: sắt, photpho, canxi và các vitamin A, C, B…. Thông thường người ta sẽ dùng củ sắn để ăn sống hoặc chế biến thành nhiều món ăn như: xào, luộc hay nấu canh,...",
            "price": 21000,
            "categoryId": 1,
            "bestseller": 1
        },
        {
            "id": 14,
            "img": "pr-baroiheo.jpg",
            "name": "Ba rọi heo",
            "description": "Ba rọi heo G được đóng gói và bảo quản đạt các tiêu chuẩn về an toàn thực phẩm. Tỉ lệ nạc mỡ xen kẽ hoàn hảo, thịt ba chỉ nhiều hơn mỡ nên thường dùng để kho với trứng, luộc, chiên hoặc nướng. Thịt heo có thể dùng điện thoại quét mã QR trên tem sản phẩm để kiểm tra nguồn gốc.",
            "price": 180000,
            "categoryId": 3,
            "bestseller": 0
        },
        {
            "id": 15,
            "img": "pr-bapbo.jpg",
            "name": "Bắp bò Fohla",
            "description": "Thịt bắp bò tươi ngon, chất lượng, thịt mềm. Thịt bò được đảm bảo nguồn gốc xuất xứ rõ ràng. Thịt bắp bò có thể chế biến thành nhiều món ăn ngon như bắp bò làm gỏi, bắp bò hầm thuốc bắc,...",
            "price": 400000,
            "categoryId": 3,
            "bestseller": 1
        },
        {
            "id": 16,
            "img": "pr-ucga.jpg",
            "name": "Ức gà phi lê ",
            "description": "Ức gà tươi phi lê có da đạt các tiêu chuẩn về an toàn, chất lượng, được lấy từ thịt gà công nghiệp. Thịt gà C.P xuất xứ rõ ràng, được dùng nhiều trong chế độ ăn uống khoa học như giảm cân, tăng cơ bắp. Ức gà có 2 mã QR để khách hàng có thể truy xuất nguồn gốc thịt, vô cùng an tâm.",
            "price": 89000,
            "categoryId": 3,
            "bestseller": 0
        },
        {
            "id": 17,
            "img": "pr-tom.jpg",
            "name": "Tôm thẻ Minh",
            "description": "Tôm thẻ Minh Phú tươi ngon vô cùng, tôm to, thịt ngọt và cầm rất chắc tay, dùng làm nguyên liệu chính cho nhiều món ăn. Tôm thẻ chứa nhiều năng lượng và protein tốt cho cơ thể, từ trẻ em cho đến người già ai cũng có thể ăn tôm thẻ.",
            "price": 49000,
            "categoryId": 3,
            "bestseller": 1
        },
        {
            "id": 18,
            "img": "pr-muc.jpg",
            "name": "Mực nang nguyên",
            "description": "Mực nang có thân to, thớ thịt dày, có vị ngọt và giòn hơn các loại mực khác. Vì thế mực nang là nguyên liệu chế biến nhiều món ăn ngon, một số món đặc biệt trong gia đình là mực xào chua ngọt, mực xào sa tế, mực chiên giòn,.... Mua về chế biến cho cả nhà ăn thử ngay nhé.",
            "price": 275000,
            "categoryId": 3,
            "bestseller": 0
        },
        {
            "id": 19,
            "img": "pr-trungga.jpg",
            "name": "Trứng gà QLEgg",
            "description": "Trứng gà QLEgg hộp 10 quả được đóng gói và bảo quản theo những tiêu chuẩn nghiêm ngặt về vệ sinh và an toàn thực phẩm, đảm bảo về chất lượng của thực phẩm. Trứng gà to tròn, đều. Trứng gà QLEgg có thể luộc chín chế biến thành một số món ăn khác như: thịt kho trứng, cơm chiên trứng,...",
            "price": 89000,
            "categoryId": 3,
            "bestseller": 1
        }, 
        {
            "id": 20,
            "img": "pr-giosong.jpg",
            "name": "Giò sống ",
            "description": "Giò sống của thương hiệu thịt heo MVP được đóng gói và bảo quản theo những tiêu chuẩn nghiêm ngặt về vệ sinh và an toàn thực phẩm, đảm bảo về chất lượng, độ tươi và ngon của thực phẩm, xuất xứ rõ ràng. Giò thịt heo được nêm nếm vừa miệng nên rất được ưa chuộng để làm chả như chả cốm, chả lá lốt, mọc,...",
            "price": 180000,
            "categoryId": 3,
            "bestseller": 0
        }, 
        {
            "id": 21,
            "img": "pr-caibe.jpg",
            "name": "Cải bẹ xanh",
            "description": "Cải bẹ xanh với vị nồng, cay đặc trưng, thích hợp dùng để nấu canh, ăn sống, xào, luộc,... tạo nên nhiều món ăn thơm ngon và cung cấp dinh dưỡng cho cơ thể. Cải bẹ xanh tại Bách hoá XANH đảm bảo nguồn gốc, được trồng và thu hoạch tại khu vực miền Tây.",
            "price": 21000,
            "categoryId": 1,
            "bestseller": 1
        }, 
        {
            "id": 22,
            "img": "pr-den.jpg",
            "name": "Rau dền",
            "description": "Rau dền tươi ngon vô cùng, bạn có thể dễ dàng tìm được rau dền xanh mướt, rau đã tươi và ngon thì nấu món gì cũng hấp dẫn. Bạn có thể tham khảo canh rau dền tôm, cháo rau dền tôm,... thơm ngon mà cả nhà ai cũng thích",
            "price": 21000,
            "categoryId": 1,
            "bestseller": 0
        }, 
        {
            "id": 23,
            "img": "pr-muong.jpg",
            "name": "Rau muống nước",
            "description": "Rau muống nước được trồng và đóng gói theo những tiêu chuẩn nghiêm ngặt, bảo đảm các tiêu chuẩn xanh - sach, chất lượng và an toàn với người dùng. Rau muống nước giòn, ngọt, chứa nhiều dinh dưỡng đặc biệt là sắt nên thường được sử dụng cho các món xào, luộc hoặc nhúng lẩu.",
            "price": 89000,
            "categoryId": 1,
            "bestseller": 1
        }
    ],
    "categories": [
        {
            "id": 1,
            "name": "Rau củ",
            "img": "DanhMuc-RauCu.jpg"
        },
        {
            "id": 2,
            "name": "Trái cây",
            "img": "DanhMuc-TraiCay.jpg"
        },
        {
            "id": 3,
            "name": "Thịt",
            "img": "DanhMuc-Thit.jpg"
        }
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
