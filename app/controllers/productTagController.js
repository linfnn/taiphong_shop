const status = require("../constants/constants");
const { default: mongoose } = require("mongoose");
const productTagModel = require('../models/productTagModel')
const notFoundProductTag = 'Not found any product tag'
const diacritics = require('diacritics');
const productModel = require("../models/productModel");

// Get all product by tags, priceMin, priceMax, page, limit
const getAllProductTags = async (req, res) => {
    try {
        const productTagFound = await productTagModel.find()
        if (productTagFound && productTagFound.length > 0) {
            status.successPaginationStatus(res, productList, 'Get all products tags successfully')
        } else {
            status.notFoundStatus(res, notFoundProductTag)
        }
    } catch (error) {
        status.errorStatus(res, error)
    }
}

// Get product by id
const getProductTagById = async (req, res) => {
    try {
        const productTagId = req.params.productTagId
        if (!mongoose.Types.ObjectId.isValid(productTagId)) {
            status.badRequestStatus(res, 'Product tag id is invalid')
        }
        const productTagList = await productTagModel.findById(productTagId)
        // const isExistProduct = productList.filter(product => product.isDeleted === false)
        if (productTagList && productTagList.length > 0) {
            status.successStatus(res, productTagList, 'Get product tag by id successfully')
        } else {
            status.notFoundStatus(res, notFoundProductTag)
        }
    } catch (error) {
        status.errorStatus(res, error)
    }
}

// create new product
const createProductTag = async (req, res) => {
    try {
        const { tagArr } = req.body
        for (let i = 0; i < tagArr.length; i++) {
            const isUnique = await productTagModel.find({ name: tagArr[i].name })
            if (!tagArr[i].name || isUnique.name !== 0) {
                status.badRequestStatus(res, 'name is required & must be unique value')
            }
        }
        const newProductTags = tagArr.map(product => {
            let withoutDiacritics = diacritics.remove(product.name);
            let formatName = withoutDiacritics.toLowerCase().split(' ').join('_')
            return {
                _id: new mongoose.Types.ObjectId(),
                name: product.name,
                link: `https://taiphong-shop.onrender.com/${formatName}`,
            }
        })
        const createdProductTags = await productTagModel.insertMany(newProductTags)
        status.successCreateStatus(res, createdProductTags, 'Create new product tags successfully')
    } catch (error) {
        status.errorStatus(res, error)
    }
}

// create new product
const updateProductTag = async (req, res) => {
    try {
        const productTagId = req.params.productTagId
        if (!mongoose.Types.ObjectId.isValid(productTagId)) {
            status.badRequestStatus(res, 'Product tag id is invalid')
        }
        let withoutDiacritics = diacritics.remove(req.body.name);
        let formatName = withoutDiacritics.toLowerCase().split(' ').join('_')
        const tagObj = {
            name: req.body.name,
            link: `https://taiphong-shop.onrender.com/${formatName}`,
        }

        const updatedProductTag = await productTagModel.findByIdAndUpdate(productTagId, tagObj)
        if (updatedProductTag && updatedProductTag.length > 0) {
            status.successStatus(res, await productTagModel.findById(productTagId), 'Update product by id successfully')
        } else {
            status.notFoundStatus(res, notFoundProductTag)
        }
    } catch (error) {
        status.errorStatus(res, error)
    }
}

const deleteProductTag = async (req, res) => {
    try {
        const productTagId = req.params.productTagId
        // const orderId = req.params.orderId
        if (!mongoose.Types.ObjectId.isValid(productTagId)) {
            status.badRequestStatus(res, 'Product Id is invalid')
        }
        const deletedProductTag = await productTagModel.findByIdAndDelete(productTagId)
        if (deletedProductTag && deletedProductTag.length > 0) {
            status.successStatus(res, deletedProductTag, 'delete product successfully')
        } else {
            status.notFoundStatus(res, notFoundProductTag)
        }
    } catch (error) {
        status.errorStatus(res, error)
    }
}


module.exports = {
    getAllProductTags,
    getProductTagById,
    createProductTag,
    updateProductTag,
    deleteProductTag
}