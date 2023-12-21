const mongoose = require('mongoose')

const ratingProductModel = new mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    rating: {
        type: Number,
        required: true
    },
    product: {
        type: mongoose.Types.ObjectId,
        ref: 'products'
    },
    opinion: {
        type: String
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
})

module.exports = mongoose.model("ratingProducts", ratingProductModel);