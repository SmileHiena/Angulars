var express = require('express');
var router = express.Router();
const multer = require('multer');
const bcrypt = require('bcrypt');
//Thiết lập nơi lưu trữ và tên file
let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/images')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})
//Kiểm tra file upload
function checkFileUpLoad(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return cb(new Error('Bạn chỉ được upload file ảnh'));
    }
    cb(null, true);
}
//Upload file
let upload = multer({ storage: storage, fileFilter: checkFileUpLoad });

//Imort model
const connectDb = require('../models/db');

//---------------------------Products--------------------------------//

router.get('/', async (req, res, next) => {

    res.render('api');
});


router.get('/products/hot', async (req, res) => {
    try {
        const db = await connectDb();
        const productCollection = db.collection('products');

        // Truy vấn sản phẩm nổi bật (bestseller = 1)
        const hotProducts = await productCollection.find({ bestseller: 1 }).toArray();

        if (hotProducts.length > 0) {
            res.status(200).json(hotProducts); // Trả về danh sách sản phẩm nổi bật dưới dạng JSON
        } else {
            res.status(404).json({ message: 'Không tìm thấy sản phẩm nổi bật.' });
        }
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: 'Đã xảy ra lỗi khi lấy dữ liệu sản phẩm nổi bật.' });
    }
});

//Trả về json danh sách sản phẩm
router.get('/products', async (req, res, next) => {
    const db = await connectDb();
    const productCollection = db.collection('products');
    const products = await productCollection.find().toArray();
    if (products) {
        res.status(200).json(products);
    } else {
        res.status(404).json({ message: 'Not found' });

    }
});

//Trả về json sản phẩm theo id
router.get('/products/:id', async (req, res, next) => {
    const db = await connectDb();
    const productCollection = db.collection('products');
    let id = req.params.id;
    const product = await productCollection.findOne({ id: parseInt(id) });
    if (product) {
        res.status(200).json(product);
    } else {
        res.status(404).json({ message: 'Not found' });

    }
});

//Thêm sản phấm
router.post('/products', async (req, res, next) => {
    let { name, price, categoryId, img, description } = req.body;
    // let img = req.file;
    const db = await connectDb();
    const productCollection = db.collection('products');
    let lastProduct = await productCollection.find().sort({ id: - 1 }).limit(1).toArray();
    let id = lastProduct[0] ? lastProduct[0].id + 1 : 1;
    let newProduct = { id, name, price, categoryId, img, description };
    await productCollection.insertOne(newProduct);
    if (newProduct) {
        res.status(200).json(newProduct);
    } else {
        res.status(404).json({ message: 'Not found' });

    }
})

//Sửa sản phấm trả về json
router.put('/products/:id', async (req, res, next) => {
    let id = req.params.id;
    const db = await connectDb();
    const productCollection = db.collection('products');
    let { name, price, img, categoryId, description } = req.body;
    // if (req.file) {
    //     var img = req.file.originalname;
    // } else {
    //     let product = await productCollection.findOne({ id: parseInt(id) });
    //     var img = product.img;
    // }
    let editProduct = { name, price, categoryId, img, description };
    product = await productCollection.updateOne({ id: parseInt(id) }, { $set: editProduct });
    if (product) {
        res.status(200).json(editProduct);
    } else {
        res.status(404).json({ message: 'Not found' });
    }
})


//Xóa sản phẩm trả về json
router.delete('/products/:id', async (req, res, next) => {
    let id = req.params.id;
    const db = await connectDb();
    const productCollection = db.collection('products');
    let product = await productCollection.deleteOne({ id: parseInt(id) });
    if (product) {
        res.status(200).json({ message: 'Xóa thành công' });
    } else {
        res.status(404).json({ message: 'Not found' });
    }
})


//---------------------------Categories--------------------------------//

// Lấy danh sách các danh mục
router.get('/categories', async (req, res, next) => {
    try {
        const db = await connectDb();
        const categoriesCollection = db.collection('categories');
        const categories = await categoriesCollection.find().toArray();
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Thêm danh mục mới
router.post('/categories',  async (req, res, next) => {
    try {
        const db = await connectDb();
        const categoriesCollection = db.collection('categories');
        let { name, img } = req.body;
        // let img = req.file ? req.file.originalname : null; // Kiểm tra xem req.file có tồn tại không trước khi truy cập thuộc tính 'originalname'
        let lastCategory = await categoriesCollection.find().sort({ id: -1 }).limit(1).toArray();
        let id = lastCategory[0] ? lastCategory[0].id + 1 : 1;
        let newCategory = { id, name, img };
        await categoriesCollection.insertOne(newCategory);
        res.status(201).json(newCategory);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Lấy danh mục theo ID
router.get('/categories/:id', async (req, res, next) => {
    try {
        const categoryId = parseInt(req.params.id); // Lấy ID của danh mục từ request params
        const db = await connectDb();
        const categoriesCollection = db.collection('categories');

        // Tìm danh mục theo ID
        const category = await categoriesCollection.findOne({ id: categoryId });

        if (category) {
            res.status(200).json(category); // Trả về danh mục dưới dạng JSON
        } else {
            res.status(404).json({ message: 'Không tìm thấy danh mục.' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Sửa danh mục
router.put('/categories/:id', upload.single('img'), async (req, res, next) => {
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
        res.status(200).json(editCategory);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Xóa danh mục
router.delete('/categories/:id', async (req, res, next) => {
    try {
        let id = req.params.id;
        const db = await connectDb();
        const categoriesCollection = db.collection('categories');
        await categoriesCollection.deleteOne({ id: parseInt(id) });
        res.status(200).json({ message: 'Xóa thành công' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

//---------------------------Mới Học--------------------------------//

// Lấy danh sách sản phẩm theo Mã danh mục
router.get('/products/categoryId/:id', async (req, res, next) => {
    try {
        const categoryId = parseInt(req.params.id); // Lấy category ID từ request params
        const db = await connectDb();
        const productCollection = db.collection('products');
        const products = await productCollection.find({ categoryId: categoryId }).toArray(); // Lọc danh sách sản phẩm dựa trên category ID
        if (products.length > 0) {
            res.status(200).json(products); // Trả về danh sách sản phẩm dưới dạng JSON
        } else {
            res.status(404).json({ message: 'Không tìm thấy sản phẩm cho danh mục này.' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Lấy danh sách sản phẩm theo Tên danh mục
router.get('/products/categoryName/:name', async (req, res, next) => {
    try {
        const categoryName = req.params.name; // Lấy tên danh mục từ request params
        const db = await connectDb();
        const categoriesCollection = db.collection('categories');

        // Tìm danh mục có tên chứa từ khóa tìm kiếm
        const category = await categoriesCollection.findOne({ name: { $regex: categoryName, $options: 'i' } });

        if (!category) {
            return res.status(404).json({ message: 'Không tìm thấy danh mục.' });
        }

        const categoryId = category.id; // Lấy ID của danh mục
        const productCollection = db.collection('products');

        // Lọc danh sách sản phẩm dựa trên categoryId
        const products = await productCollection.find({ categoryId: categoryId }).toArray();

        if (products.length > 0) {
            res.status(200).json(products); // Trả về danh sách sản phẩm dưới dạng JSON
        } else {
            res.status(404).json({ message: 'Không tìm thấy sản phẩm cho danh mục này.' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Lấy danh sách sản phẩm nổi bật có bestseller = 1 Đang hỏng nặng


// Trả về danh sách sản phẩm dựa trên trang và số lượng
router.get('/products/page/:page/limit/:limit', async (req, res, next) => {
    try {
        const page = parseInt(req.params.page) || 1; // Lấy trang từ params URL, mặc định là trang 1 nếu không có
        const limit = parseInt(req.params.limit) || 10; // Lấy số lượng từ params URL, mặc định là 10 nếu không có
        const skip = (page - 1) * limit; // Tính vị trí bắt đầu của trang hiện tại

        const db = await connectDb();
        const productCollection = db.collection('products');

        // Sử dụng phương thức skip() và limit() để phân trang và giới hạn số lượng
        const products = await productCollection.find().skip(skip).limit(limit).toArray();

        if (products.length > 0) {
            res.status(200).json(products); // Trả về danh sách sản phẩm dưới dạng JSON
        } else {
            res.status(404).json({ message: 'Không tìm thấy sản phẩm.' });
        }
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Trả về danh sách sản phẩm dựa trên từ khóa tìm kiếm
router.get('/products/search/:keyword', async (req, res, next) => {
    try {
        let keyword = req.params.keyword; // Lấy từ khóa tìm kiếm từ URL params

        // Tạo một biến regular expression từ từ khóa, cho phép không phân biệt chữ hoa chữ thường
        const regexKeyword = new RegExp(keyword, 'i');

        // Tạo một biến regular expression từ từ khóa, xử lý việc tìm kiếm cho các chữ số và ký tự "k" hoặc "K"
        const regexKeywordWithK = new RegExp(keyword.replace(/[kK]/g, '[kK]?'), 'i');

        const db = await connectDb();
        const productCollection = db.collection('products');

        // Tìm các sản phẩm có tên chứa từ khóa tìm kiếm (sử dụng regex và tùy chọn không phân biệt chữ hoa chữ thường)
        const products = await productCollection.find({ $or: [{ name: regexKeyword }, { name: regexKeywordWithK }] }).toArray();

        if (products.length > 0) {
            res.status(200).json(products); // Trả về danh sách sản phẩm dưới dạng JSON
        } else {
            res.status(404).json({ message: 'Không tìm thấy sản phẩm nào phù hợp với từ khóa tìm kiếm.' });
        }
    } catch (error) {
        console.error("Error searching products:", error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Trả về danh sách sản phẩm được sắp xếp và giới hạn số lượng
router.get('/products/sort/:order/limit/:limit', async (req, res, next) => {
    try {
        const order = req.params.order.toLowerCase(); // Lấy thứ tự sắp xếp từ URL params và chuyển thành chữ thường
        const limit = parseInt(req.params.limit) || 10; // Lấy số lượng từ URL params, mặc định là 10 nếu không có

        const db = await connectDb();
        const productCollection = db.collection('products');

        let sortQuery = {}; // Khởi tạo truy vấn sắp xếp rỗng

        // Xác định trường sắp xếp dựa trên order
        if (order === 'asc') {
            sortQuery = { price: 1 }; // Sắp xếp theo giá tăng dần
        } else if (order === 'desc') {
            sortQuery = { price: -1 }; // Sắp xếp theo giá giảm dần
        } else {
            return res.status(400).json({ message: 'Thứ tự sắp xếp không hợp lệ.' }); // Trả về lỗi nếu thứ tự sắp xếp không hợp lệ
        }

        // Sử dụng phương thức sort() và limit() để sắp xếp và giới hạn số lượng sản phẩm
        const products = await productCollection.find().sort(sortQuery).limit(limit).toArray();

        if (products.length > 0) {
            res.status(200).json(products); // Trả về danh sách sản phẩm dưới dạng JSON
        } else {
            res.status(404).json({ message: 'Không tìm thấy sản phẩm.' });
        }
    } catch (error) {
        console.error("Error sorting products:", error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

//---------------------------Users--------------------------------//


//Trả về json danh sách users
router.get('/users', async (req, res, next) => {
    const db = await connectDb();
    const userCollection = db.collection('users');
    const users = await userCollection.find().toArray();
    if (users) {
        res.status(200).json(users);
    } else {
        res.status(404).json({ message: 'Not found' });
    }
});

//Trả về json users theo id
router.get('/users/:id', async (req, res, next) => {
    const db = await connectDb();
    const usersCollection = db.collection('users');
    let id = req.params.id;
    const users = await usersCollection.findOne({ id: parseInt(id) });
    if (users) {
        res.status(200).json(users);
    } else {
        res.status(404).json({ message: 'Not found' });
    }
});

//Post thêm users
router.post('/users', async (req, res, next) => {
    let {fullname, username, sdt, password, repassword, email, role } = req.body;
    let img = req.file;
    const db = await connectDb();
    const usersCollection = db.collection('users');
    let lastUser = await usersCollection.find().sort({ id: -1 }).limit(1).toArray();
    let id = lastUser[0] ? lastUser[0].id + 1 : 1;
    let newUser = { id, fullname, username, password, sdt, email, isAdmin: role === '0' };
    await usersCollection.insertOne(newUser);
    if (newUser) {
        res.status(200).json(newUser);
    } else {
        res.status(404).json({ message: 'Not found' });
    }
});

//Put sửa users từ form
router.put('/users/:id', upload.single('img'), async (req, res, next) => {
    let id = req.params.id;
    const db = await connectDb();
    const usersCollection = db.collection('users');
    let { username, password, email } = req.body;
    if (req.file) {
        var img = req.file.originalname;
    } else {
        //láy danh mục tư id để lấy img cũ
        let users = await usersCollection.findOne({ id: parseInt(id) });
        var img = users.img;
    }
    let editUsers = { username, password, email, img };
    users = await usersCollection.updateOne({ id: parseInt(id) }, { $set: editUsers });
    if (users) {
        res.status(200).json(editUsers);
    } else {
        res.status(404).json({ message: 'Sửa không thành kông.' });
    }
});

//Xóa users
router.delete('/users/:id', async (req, res, next) => {
    let id = req.params.id;
    const db = await connectDb();
    const usersCollection = db.collection('users');
    let user = await usersCollection.deleteOne({ id: parseInt(id) });
    if (user) {
        res.status(200).json({ message: 'Xoa thanhkong.' });
    } else {
        res.status(404).json({ message: 'Xoa khong thanhkong.' });
    }
});

router.post('/users/register', async (req, res, next) => {
    let { email, password, fullname, username } = req.body;
    const db = await connectDb();
    const userCollection = db.collection('users');
    let user = await userCollection.findOne({ email: email });
    if (user) {
        res.status(409).json({ message: "Email đã tồn tại" });
    } else {
        let lastuser = await userCollection.find().sort({ id: -1 }).limit(1).toArray();
        let id = lastuser[0] ? lastuser[0].id + 1 : 1;
        const salt = bcrypt.genSaltSync(10);
        let hashPassword = bcrypt.hashSync(password, salt);
        let newUser = { id: id, email, password: hashPassword, fullname, username, isAdmin: 0 };
        try {
            let result = await userCollection.insertOne(newUser);
            console.log(result);
            res.status(200).json({ message: "Đăng ký thành công" });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Lỗi khi thêm người dùng mới" });
        }
    }
})
router.get('/users/username/:username', async (req, res, next) => {
    try {
      const db = await connectDb();
      const usersCollection = db.collection('users');
      const { fullname, phoneNumber } = req.body;
      const editUserInfo = { fullname, phoneNumber };
      const username = req.params.username;
  
      const updatedUser = await usersCollection.updateOne({ username: username }, { $set: editUserInfo });
  
      if (updatedUser.modifiedCount > 0) {
        res.status(200).json(editUserInfo);
      } else {
        res.status(404).json({ message: 'Không tìm thấy người dùng hoặc không có sự thay đổi.' });
      }
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ message: 'Đã xảy ra lỗi khi cập nhật thông tin người dùng.' });
    }
  });

  router.put('/users/username/:username', async (req, res, next) => {
    try {
      const db = await connectDb();
      const usersCollection = db.collection('users');
      const { fullname, phoneNumber } = req.body;
      const editUserInfo = { fullname, phoneNumber };
      const username = req.params.username;
  
      const updatedUser = await usersCollection.updateOne({ username: username }, { $set: editUserInfo });
  
      if (updatedUser.modifiedCount > 0) {
        res.status(200).json(editUserInfo);
      } else {
        res.status(404).json({ message: 'Không tìm thấy người dùng hoặc không có sự thay đổi.' });
      }
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ message: 'Đã xảy ra lỗi khi cập nhật thông tin người dùng.' });
    }
  });

const jwt = require('jsonwebtoken');

router.post('/users/login', upload.single('img'), async (req, res, next) => {
    let { username, password } = req.body;

    const db = await connectDb();
    const userCollection = db.collection('users');
    let user = await userCollection.findOne({ username: username });

    if (user) {
        if (bcrypt.compareSync(password, user.password)) {
            const token = jwt.sign({
                username: user.username,
                email: user.email,
                sdt: user.sdt,
                fullname: user.fullname, // Thêm fullname vào payload của token
                isAdmin: user.isAdmin
            }, 'secretkey', { expiresIn: '10s' });
            res.status(200).json({ token: token,username: user.username, email: user.email, sdt: user.sdt, fullname: user.fullname, isAdmin: user.isAdmin }); // Trả về fullname cùng với token
        } else {
            res.status(403).json({ message: 'username hoặc mật khẩu không đúng cho lắm' })
        }
    } else {
        res.status(403).json({ messsage: 'Đăng ký cái nhẹ đi bạn ơi' });
    }

});

//Xác thực token
function authenToken(req, res, next) {
    const bearerHeader = req.headers['authorization'];
    if (typeof bearerHeader !== 'undefined') {
        const bearerToken = bearerHeader.split(' ')[1];
        req.token = bearerToken;
        jwt.verify(req.token, 'secretkey', (err, authData) => {
            if (err) {
                res.status(403).json({ message: "Không có quyền truy cập" });
            } else {
                next();
            }
        })
    } else {
        res.status(403).json({ message: "Không có quyền truy cập" });
    }
}



module.exports = router;

