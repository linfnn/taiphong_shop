const express = require("express");
const productImageRouter = express.Router();

productImageRouter.post('/upload')


const multer = require('multer');
const path = require('path');
const fs = require('fs')
const { createProductImgs, getAllProductImgs } = require("../controllers/productImgController");
// Multer 
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Thư mục lưu trữ tệp tin
    },
    // destination: (req, file, cb) => {
    //     // Lấy giá trị từ request, chẳng hạn như một trường có tên là "category"
    //     const category = req.body.productId || 'productImages';

    //     // Tạo đường dẫn thư mục dựa trên giá trị "category"
    //     const uploadDir = path.join('uploads', category);

    //     // Tạo thư mục nếu chưa tồn tại
    //     fs.mkdirSync(uploadDir, { recursive: true });

    //     cb(null, uploadDir);
    // },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    },
});
const upload = multer({ storage: storage });

productImageRouter.get('/get-images', getAllProductImgs)
// productImageRouter.get('/get-images/:imageId',get)
productImageRouter.post('/post-images', upload.array('images'), createProductImgs)


// // Đường dẫn đến thư mục chứa ảnh
// const uploadDir = 'uploads/';


// const Image = require('../models/testImageModel');
// productImageRouter.post('/upload', upload.array('images'), async (req, res) => {
//     try {
//         // const { productId } = req.body
//         // Tạo một bản ghi trong mô hình Image
//         // req.files.forEach(file => {
//         for (let i = 0; i < req.files.length; i++) {
//             const newImage = new Image({
//                 // file: req.files[i].filename,
//                 path: req.files[i].path
//             });
//             // Lưu vào cơ sở dữ liệu
//             await newImage.save();
//         }
//         // })
//         // Trả về phản hồi
//         res.send('File uploaded and record created!');
//     } catch (error) {
//         console.error(error);
//         res.status(500).send('Internal Server Error');
//     }
// });

// productImageRouter.put('/update/:filename', upload.single('file'), (req, res) => {
//     const oldFilename = req.params.filename;
//     const oldFilePath = path.join(uploadDir, oldFilename);

//     // Kiểm tra xem tệp tin cũ tồn tại trước khi sửa
//     if (fs.existsSync(oldFilePath)) {
//         // Xóa tệp tin cũ
//         fs.unlinkSync(oldFilePath);

//         // Lấy tên tệp tin mới
//         const newFilename = req.file.filename;
//         res.send(`Ảnh đã được sửa thành công. Tên mới: ${newFilename}`);
//     } else {
//         res.status(404).send('Không tìm thấy ảnh cần sửa.');
//     }
// });

module.exports = { productImageRouter }