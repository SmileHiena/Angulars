var express = require('express');
var router = express.Router();

// Trong route hoặc controller
router.get('/home', (req, res) => {
  // Lấy giá trị của userAvatar và userFullName từ session
  const userAvatar = req.session.user ? req.session.user.avatar : null;
  const userFullName = req.session.user ? req.session.user.fullname : '';
  
  // Truyền dữ liệu userAvatar và userFullName đến trang index.ejs
  res.render('index', { userAvatar: userAvatar, userFullName: userFullName });
});

module.exports = router;
