const mongoose = require("mongoose");

const productModel = new mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    title: {
        type: String,
        unique: true,
        required: true
    },
    price: {
        type: Number,
        required: true,
        default: 0
    },
    rating: [
        {
            type: Number,
            default: []
        }
    ],
    averageRating: {
        type: Number,
        default: 0
    },
    stock: {
        type: Number,
        default: 0,
        required: true
    },
    tags: [
        {
            type: mongoose.Types.ObjectId,
            ref: 'productTags'
        }
    ],
    description: {
        type: String
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model("products", productModel);
