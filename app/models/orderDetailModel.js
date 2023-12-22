//B1: Khai bao thu vien mongoose
const mongoose = require('mongoose');

//B2: Khai bao thu vien Schema cua mongoose
const Schema = mongoose.Schema;

//B3: Tao doi tuong Schema bao gom cac thuoc tinh cua collection
const orderDetailSchema = new Schema({
    _id: mongoose.Types.ObjectId,
    productId: {
        type: mongoose.Types.ObjectId,
        ref: 'products',
        required: true
    },
    quantity: {
        type: Number,
        default: 0,
        required: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
})
//B4: export Schema ra model
module.exports = mongoose.model('orderDetails', orderDetailSchema)