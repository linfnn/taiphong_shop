const mongoose = require('mongoose')

const productTagModel = new mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    name: {
        type: String,
        required: true,
        unique: true
    },
    link: {
        type: String,
        unique: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
})

module.exports = mongoose.model("productTags", productTagModel);