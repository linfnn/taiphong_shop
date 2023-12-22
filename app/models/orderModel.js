//B1: Khai bao thu vien mongoose
const mongoose = require('mongoose');

//B2: Khai bao thu vien Schema cua mongoose
const Schema = mongoose.Schema;

//B3: Tao doi tuong Schema bao gom cac thuoc tinh cua collection
//B3: Tao doi tuong Schema bao gom cac thuoc tinh cua collection
const orderSchema = new Schema({
    _id: mongoose.Types.ObjectId,
    orderDate: {
        type: Date,
        default: Date.now()
    },
    shippedDate: {
        type: Date,
        default: () => new Date(new Date().getTime() + 5 * 24 * 60 * 60 * 1000)
    },
    note: String,
    orderDetails: [
        {
            type: mongoose.Types.ObjectId,
            ref: 'orderDetails'
        }
    ],
    cost: {
        type: Number,
        default: 0
    },
    shippedTo: {
        type: mongoose.Types.ObjectId,
        ref: 'receivingInfo'
    },
    status: {
        type: String,
        default: 'Đã đặt'
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
});
//B4: export Schema ra model
module.exports = mongoose.model("orders", orderSchema);
