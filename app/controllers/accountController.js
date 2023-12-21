const mongoose = require('mongoose')

const accountModel = new mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    avatar: {
        type: String
    },
    gender: {
        type: String
    },
    receivingInfo: [
        {
            type: mongoose.Types.ObjectId,
            ref: 'receivingInfos'
        }
    ],
    orders: [
        {
            type: mongoose.Types.ObjectId,
            ref: 'orders'
        }
    ],
    rating: [
        {
            type: mongoose.Types.ObjectId,
            ref: 'ratingProducts'
        }
    ],
    isDeleted: {
        type: Boolean,
        default: false
    }
})

module.exports = mongoose.model("accounts", accountModel);