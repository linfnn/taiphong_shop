const express = require('express')
const app = express()
const port = 8000
const cors = require('cors')
const path = require('path')

app.use(express.json())
app.use(cors())
// khai báo và connect mongoDB
const { initial } = require('./role')
const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://nguyetnga0308:nguyetnga0308@cluster0.febhoc4.mongodb.net/taiphong_shop')
    .then(() => {
        console.log('Successfully connected to MongoDB')
        initial()
    })
    .catch(err => console.log(err))

// Khai báo các model
const { productModel } = require('./app/models/productModel')
const { productImagesModel } = require('./app/models/productImagesModel')
const { productTagModel } = require('./app/models/productTagModel')
const { accountModel } = require('./app/models/accountModel')
const { orderModel } = require('./app/models/orderModel')
const { orderDetailModel } = require('./app/models/orderDetailModel')
const { ratingModel } = require('./app/models/ratingModel')
const { receivingInfoModel } = require('./app/models/receivingInfoModel')

// Sử dụng middleware để phục vụ các tệp tĩnh từ thư mục 'public'
app.use(express.static(path.join(__dirname, 'views')));

// Đường dẫn mặc định sẽ là index.html trong thư mục 'public'
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// Router
const { productImageRouter } = require('./app/routers/productImgRoute')
const { productRouter } = require('./app/routers/productRoute')
const { productTagRouter } = require('./app/routers/productTagRoute')
const { orderRouter } = require('./app/routers/orderRoute')
const { orderDetailRouter } = require('./app/routers/orderDetailRoute')

app.use('/', productImageRouter)
app.use('/', productRouter)
app.use('/', productTagRouter)
app.use('/', orderRouter)
app.use('/', orderDetailRouter)
app.listen(port, () => console.log(`App listening at: ${port}`))
