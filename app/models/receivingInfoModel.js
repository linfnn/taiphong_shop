const mongoose = require('mongoose')

const receivingInfoModel = new mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    name: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true
    },
    address: {
        type: String,
        default: ''
    },
    city: {
        type: String
    },
    country: {
        type: String
    },
    note: {
        type: String
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
})

module.exports = mongoose.model("receivingInfos", receivingInfoModel);