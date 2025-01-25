var express = require('express');
var router = express.Router();
const multer = require('multer');

// Thiết lập nơi lưu trữ và tên file
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/images');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

// Kiểm tra file upload
function checkFileUpload(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return cb(new Error('Bạn chỉ được upload file ảnh'));
    }
    cb(null, true);
}

// Upload file
const upload = multer({
    storage: storage,
    fileFilter: checkFileUpload,
    limits: {
        fileSize: 5 * 1024 * 1024 // Giới hạn dung lượng tệp là 5MB
    }
});

module.exports = upload;


//Thực hiện gọi đến model db
const connectDb = require('../models/db');

//Hiển thị trang sản phẩm
router.get('/', async (req, res, next) => {
    const db = await connectDb();
    const productsCollection = db.collection('products');
    const products = await productsCollection.find().toArray();
    const user = req.session.user; // Lấy thông tin user từ session
    res.render('product', { products, user }); // Truyền thông tin người dùng vào view
});


//Hiển thị trang thêm sản phẩm
router.get('/add', function (req, res, next) {
    const user = req.session.user; // Lấy thông tin user từ session
    res.render('addProduct', { user });
});

//Post thêm sản phẩm
router.post('/add', upload.single('img'), async (req, res, next) => {
    const db = await connectDb();
    const productsCollection = db.collection('products');
    let { name, price, categoryId, description } = req.body;
    let img = req.file.originalname;
    let lastProduct = await productsCollection.find().sort({ id: - 1 }).limit(1).toArray();
    let id = lastProduct[0] ? lastProduct[0].id + 1 : 1;
    let newProduct = { id, name, price, categoryId, img, description };
    await productsCollection.insertOne(newProduct);
    res.redirect('/products');
})

//Get trang sửa sản phẩm
router.get('/edit/:id', async (req, res, next) => {
    try {
        const db = await connectDb();
        const productsCollection = db.collection('products');
        const id = req.params.id;
        const product = await productsCollection.findOne({ id: parseInt(id) });
        const user = req.session.user; // Lấy thông tin user từ session
        res.render('editProduct', { product, user }); // Truyền thông tin người dùng vào view
    } catch (error) {
        next(error);
    }
});

//Post sửa sản phẩm từ form
router.post('/edit', upload.single('img'), async (req, res, next) => {
    const db = await connectDb();
    const productsCollection = db.collection('products');
    let { id, name, price, categoryId, description } = req.body;
    let img;

    // Kiểm tra xem người dùng đã tải lên hình ảnh mới hay không
    if (req.file) {
        img = req.file.originalname;
    } else {
        // Nếu không, sử dụng hình ảnh cũ từ trường ẩn trong form
        img = req.body.imgOld;
    }

    let editProduct = { name, price, categoryId, img, description };
    await productsCollection.updateOne({ id: parseInt(id) }, { $set: editProduct });
    res.redirect('/products');
});
// Xóa sản phẩm
router.get('/delete/:id', async (req, res) => {
    let id = req.params.id;
    const db = await connectDb();
    const productsCollection = db.collection('products');
    await productsCollection.deleteOne({ id: parseInt(id) });
    res.redirect('/products');
});

module.exports = router;
