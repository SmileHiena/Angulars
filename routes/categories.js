const express = require('express');
const router = express.Router();
const multer = require('multer');
const connectDb = require('../models/db');

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

// Hiển thị trang danh mục
router.get('/', async (req, res, next) => {
    try {
        const db = await connectDb();
        const categoriesCollection = db.collection('categories');
        const categories = await categoriesCollection.find().toArray();
        const user = req.session.user; // Lấy thông tin user từ session
        res.render('categorie', { categories, user }); // Truyền thông tin người dùng vào view
    } catch (error) {
        next(error);
    }
});



// Hiển thị trang thêm danh mục
router.get('/add', (req, res) => {
    const user = req.session.user; // Lấy thông tin user từ session
    res.render('addCategorie', { user }); // Truyền thông tin người dùng vào view
});


// Post thêm danh mục
router.post('/add', upload.single('img'), async (req, res, next) => {
    try {
        const db = await connectDb();
        const categoriesCollection = db.collection('categories');
        let { name } = req.body;
        let img = req.file ? req.file.originalname : null; // Kiểm tra xem req.file có tồn tại không trước khi truy cập thuộc tính 'originalname'
        let lastCategory = await categoriesCollection.find().sort({ id: -1 }).limit(1).toArray();
        let id = lastCategory[0] ? lastCategory[0].id + 1 : 1;
        let newCategory = { id, name, img };
        await categoriesCollection.insertOne(newCategory);
        res.redirect('/categories');
    } catch (error) {
        next(error);
    }
});

// Hiển thị trang sửa danh mục
router.get('/edit/:id', async (req, res, next) => {
    try {
        const db = await connectDb();
        const categoriesCollection = db.collection('categories');
        const id = req.params.id;
        const category = await categoriesCollection.findOne({ id: parseInt(id) });
        const user = req.session.user; // Lấy thông tin user từ session
        res.render('editCategorie', { category, user }); // Truyền thông tin người dùng vào view
    } catch (error) {
        next(error);
    }
});


// Post sửa danh mục từ form
router.post('/edit/:id', upload.single('img'), async (req, res, next) => {
    try {
        const db = await connectDb();
        const categoriesCollection = db.collection('categories');
        let { name } = req.body;
        let img;

        // Kiểm tra xem người dùng đã tải lên hình ảnh mới hay không
        if (req.file) {
            img = req.file.originalname;
        } else {
            // Nếu không, sử dụng hình ảnh cũ từ trường ẩn trong form
            img = req.body.imgOld;
        }

        let editCategory = { name, img };
        await categoriesCollection.updateOne({ id: parseInt(req.params.id) }, { $set: editCategory });
        res.redirect('/categories');
    } catch (error) {
        next(error);
    }
});

// Xóa danh mục
router.get('/delete/:id', async (req, res, next) => {
    try {
        let id = req.params.id;
        const db = await connectDb();
        const categoriesCollection = db.collection('categories');
        await categoriesCollection.deleteOne({ id: parseInt(id) });
        res.redirect('/categories');
    } catch (error) {
        next(error);
    }
});

module.exports = router;
