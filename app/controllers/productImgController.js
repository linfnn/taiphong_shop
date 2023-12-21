const status = require("../constants/constants");
const { default: mongoose } = require("mongoose");
const productImagesModel = require('../models/productImagesModel')
// const fs = require('fs').promises;
const fs = require('fs');
const path = require('path');
const createProductImgs = async (req, res) => {
    try {
        const { productId } = req.body
        const pathArr = req.files.map(file => file.path)
        const newImage = {
            productId,
            paths: pathArr
        }
        const createdImages = await productImagesModel.create(newImage)
        status.successCreateStatus(res, createdImages, 'Insert product images successfully')
    } catch (error) {
        status.errorStatus(res, error)
    }
}

const getAllProductImgs = async (req, res) => {
    try {
        const { productId } = req.query
        if (productId && productId != '') {
            if (!mongoose.Types.ObjectId.isValid(productId)) {
                status.badRequestStatus(res, 'Product Id is invalid')
            }
            const files = await productImagesModel.find({ productId })
            if (files && files.length > 0) {
                status.successStatus(res, files, 'Get all product images by product id successfully')
            }
            else {
                status.notFoundStatus(res, 'Not found any product images')
            }
        } else if (!productId || productId === undefined || productId === '') {
            const files = await productImagesModel.find()
            if (files && files.length > 0) {
                status.successStatus(res, files, 'Get all product images successfully')
            }
            else {
                status.notFoundStatus(res, 'Not found any product images')
            }
        }
    } catch (error) {
        status.errorStatus(res, error)
    }
}

const updateProductImgs = async (req, res) => {
    const { productId, paths } = req.body
    try {
        // Điều kiện để cập nhật các tài liệu
        const filter = { productId };

        // Các thay đổi cần thực hiện
        const update = {
            $set: { paths }
            // Hoặc sử dụng các phép toán cập nhật khác của MongoDB
        };

        // Cập nhật nhiều tài liệu dựa trên điều kiện lọc và các thay đổi
        const updatedImages = await productImagesModel.updateMany(filter, update)
        if (updatedImages && updatedImages.length > 0) {
            status.successStatus(res, updatedImages, 'Update images successfully')
        }
        else {
            status.notFoundStatus(res, 'Not found any product images')
        }
    } catch (error) {
        status.errorStatus(res, error)
    }
}

const deleteProductImgs = async (req, res) => {
    const { productId, paths } = req.body
    const productFound = await productImagesModel.find({ productId })

}


module.exports = {
    createProductImgs,
    getAllProductImgs,
    updateProductImgs
}