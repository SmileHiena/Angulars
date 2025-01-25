// users.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const bcrypt = require('bcrypt');
const connectDb = require('../models/db');

const app = require('../app')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/images'); // Đường dẫn lưu trữ ảnh
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

function checkFileUpload(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return cb(new Error('Bạn chỉ được upload file ảnh'));
    }
    cb(null, true);
}

const upload = multer({
    storage: storage,
    fileFilter: checkFileUpload,
    limits: {
        fileSize: 5 * 1024 * 1024
    }
});

router.get('/', async (req, res, next) => {
    try {
        const db = await connectDb();
        const usersCollection = db.collection('users');
        const users = await usersCollection.find().toArray();
        const user = req.session.user; // Lấy thông tin user từ session
        res.render('user', { user, users });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).send('Internal Server Error');
    }
});



router.get('/login', function (req, res, next) {
    res.render('login', { errorMessage: null });
});

router.post('/login', async (req, res, next) => {
    try {
        const db = await connectDb();
        const usersCollection = db.collection('users');
        const { email, password } = req.body;

        // Tìm người dùng theo email
        const user = await usersCollection.findOne({ email: email });

        // Kiểm tra xem người dùng có tồn tại không và mật khẩu có khớp không
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.render('login', { errorMessage: 'Email hoặc mật khẩu không đúng' });
        }

        // Đăng nhập thành công, tạo session hoặc token để đăng nhập
        // Ví dụ: sử dụng session để lưu trữ thông tin đăng nhập

        // Lưu thông tin người dùng vào session
        req.session.user = {
            id: user.id,
            email: user.email,
            fullname: user.fullname,
            isAdmin: user.isAdmin ? user.isAdmin : 0, // Kiểm tra xem user.isAdmin tồn tại trước khi truy cập
            avatar: user.avatar // Thêm avatar vào đây
        };

        // Kiểm tra isAdmin
        if (user.isAdmin == 1) {
            // Đăng nhập thành công với vai trò là 1
            // Chuyển hướng đến trang users
            res.redirect('/users');
        } else {
            // Đăng nhập thành công với vai trò 0, chuyển hướng đến trang home
            res.redirect('/home');
        }

    } catch (error) {
        console.error('Error logging in user:', error);
        res.status(500).send('Internal Server Error');
    }
});

router.get('/register', function (req, res, next) {
    res.render('register', { errorMessage: null, isAdmin: 0 });
});

router.post('/register', upload.single('avatar'), async (req, res, next) => {
    try {
        const db = await connectDb();
        const usersCollection = db.collection('users');
        let { email, password, fullname, isAdmin } = req.body;
        let avatar = req.file ? req.file.originalname : '';

        const existingUser = await usersCollection.findOne({ email: email });
        if (existingUser) {
            return res.render('register', { errorMessage: 'Email đã tồn tại', isAdmin: isAdmin });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        let lastUser = await usersCollection.find().sort({ id: -1 }).limit(1).toArray();
        let id = lastUser[0] ? lastUser[0].id + 1 : 1;
        let newUser = { id, email, password: hashedPassword, fullname, isAdmin, avatar };
        await usersCollection.insertOne(newUser);
        res.redirect('./login');
    } catch (error) {
        console.error('Error adding user:', error);
        res.status(500).send('Internal Server Error');
    }
});

router.get('/add', function (req, res, next) {
    const user = req.session.user; // Lấy thông tin user từ session
    res.render('addUser', { errorMessage: null, user: user }); // Truyền biến user vào khi render trang addUser.ejs
});


router.post('/add', upload.single('avatar'), async (req, res, next) => {
    try {
        const db = await connectDb();
        const usersCollection = db.collection('users');
        let { email, password, fullname, isAdmin } = req.body;
        let avatar = req.file ? req.file.originalname : '';

        const existingUser = await usersCollection.findOne({ email: email });
        if (existingUser) {
            return res.render('addUser', { errorMessage: 'Email đã tồn tại' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        let lastUser = await usersCollection.find().sort({ id: -1 }).limit(1).toArray();
        let id = lastUser[0] ? lastUser[0].id + 1 : 1;
        let newUser = { id, email, password: hashedPassword, fullname, isAdmin, avatar };
        await usersCollection.insertOne(newUser);
        res.redirect('/users');
    } catch (error) {
        console.error('Error adding user:', error);
        res.status(500).send('Internal Server Error');
    }
});

router.get('/edit/:id', async (req, res, next) => {
    try {
        const db = await connectDb();
        const usersCollection = db.collection('users');
        const id = req.params.id;
        const user = await usersCollection.findOne({ id: parseInt(id) });
        const isAdmin = user && user.isAdmin !== undefined ? user.isAdmin : 0;
        res.render('editUser', { user, isAdmin });
    } catch (error) {
        console.error('Error fetching user for edit:', error);
        res.status(500).send('Internal Server Error');
    }
});

router.post('/edit/:id', upload.single('avatar'), async (req, res, next) => {
    try {
        const db = await connectDb();
        const usersCollection = db.collection('users');
        const id = req.params.id;
        let { fullname, isAdmin } = req.body;
        let avatar;

        if (req.file) {
            avatar = req.file.originalname;
        } else {
            const user = await usersCollection.findOne({ id: parseInt(id) });
            avatar = user.avatar;
        }

        let editUser = { fullname, isAdmin, avatar };
        await usersCollection.updateOne({ id: parseInt(id) }, { $set: editUser });
        res.redirect('/users');
    } catch (error) {
        console.error('Error editing user:', error);
        res.status(500).send('Internal Server Error');
    }
});

router.get('/delete/:id', async (req, res) => {
    try {
        const db = await connectDb();
        const usersCollection = db.collection('users');
        const id = req.params.id;
        await usersCollection.deleteOne({ id: parseInt(id) });
        res.redirect('/users');
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).send('Internal Server Error');
    }
});
router.post('/logout', function (req, res) {
    req.session.destroy(function (err) {
        if (err) {
            console.error('Error logging out:', err);
            res.status(500).send('Internal Server Error');
        } else {
            res.redirect('http://localhost:3000/home'); // Chuyển hướng người dùng về trang chủ sau khi đăng xuất
        }
    });
});

module.exports = router;
