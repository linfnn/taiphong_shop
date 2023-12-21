
const mongoose = require("mongoose");

const productImagesModel = new mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    productId: {
        type: mongoose.Types.ObjectId,
        ref: 'products'
    },
    paths: [
        {
            type: String
        }
    ]
});

module.exports = mongoose.model("productImages", productImagesModel);
