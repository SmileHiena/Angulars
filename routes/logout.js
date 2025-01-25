// logout.js
const express = require('express');
const router = express.Router();

router.post('/', function(req, res) {
    req.session.destroy(function(err) {
        if (err) {
            console.error('Lỗi khi đăng xuất:', err);
            res.status(500).send('Lỗi máy chủ nội bộ');
        } else {
            res.redirect('/home'); // Hoặc chuyển hướng đến trang chủ khác nếu cần
        }
    });
});

module.exports = router;
