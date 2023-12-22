const status = require("../constants/constants");
const { default: mongoose } = require("mongoose");
const productModel = require('../models/productModel')
const notFoundProduct = 'Not found any product'

// Get all product by tags, priceMin, priceMax, page, limit
const getAllProducts = async (req, res) => {
    try {
        const { page, limit, priceMin, priceMax, tags } = req.query
        const condition = getConditionProducts(page, limit, priceMin, priceMax, await productModel.find())
        const totalProduct = await productModel.find({ isDeleted: false })
        const pagination = {
            total: totalProduct.length,
            perPage: limit,
            currentPage: page,
            page: Math.ceil(totalProduct.length / limit)
        }
        const productFound = await productModel
            .find({ isDeleted: false })

        if (tags === undefined || tags === '') {
            const productList = productFound.filter(product => {
                return (
                    condition.priceMin <= product.price &&
                    condition.priceMax >= product.price
                )
            }).slice((condition.page - 1) * condition.limit, condition.page * condition.limit)
            if (productList && productList.length > 0) {
                status.successPaginationStatus(res, productList, pagination, 'Get all products with conditions successfully')
            } else {
                status.notFoundStatus(res, notFoundProduct)
            }
        }
        else {
            if (!mongoose.Types.ObjectId.isValid(tags)) {
                status.badRequestStatus(res, 'Tag id is invalid')
            }
            const productList = productFound.filter(product => {
                return (
                    condition.priceMin <= product.price &&
                    condition.priceMax >= product.price &&
                    product.tags.includes(tags)
                )
            }).slice((condition.page - 1) * condition.limit, condition.page * condition.limit)
            if (productList && productList.length > 0) {
                status.successPaginationStatus(res, productList, pagination, 'Get all products with conditions successfully')
            } else {
                status.notFoundStatus(res, notFoundProduct)
            }
        }

    } catch (error) {
        status.errorStatus(res, error)
    }
}

// Get product by id
const getProductById = async (req, res) => {
    try {
        const productId = req.params.productId
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            status.badRequestStatus(res, 'Product Id is invalid')
        }
        const productList = await productModel.findById(productId)
        // const isExistProduct = productList.filter(product => product.isDeleted === false)
        if (productList) {
            status.successStatus(res, productList, 'Get product by id successfully')
        } else {
            status.notFoundStatus(res, notFoundProduct)
        }
    } catch (error) {
        status.errorStatus(res, error)
    }
}

// Hàm hỗ trợ thu thập điều kiện lọc danh sách sản phẩm
const getConditionProducts = (page, limit, priceMin, priceMax, productList) => {
    if (!page) {
        page = 1
    }
    if (!limit) {
        limit = productList.length
    }
    if (!priceMin) {
        priceMin = 0
    }
    if (!priceMax) {
        var priceMax = 0
        for (let i = 0; i < productList.length; i++) {
            if (productList[i].price > priceMax) {
                priceMax = productList[i].price
            }
        }
        priceMax = priceMax
    }

    if (page || limit || priceMin || priceMax) {
        parseInt(page)
        parseInt(limit)
        parseInt(priceMin)
        parseInt(priceMax)
    }
    return {
        page,
        limit,
        priceMin,
        priceMax
    }
}

// create new product
const createProducts = async (req, res) => {
    try {
        const { productArr } = req.body
        for (let i = 0; i < productArr.length; i++) {
            const isUnique = await productModel.find({ title: productArr[i].title })
            if (!productArr[i].title || isUnique.length !== 0) {
                status.badRequestStatus(res, 'Title is required & must be unique value')
            }
            if (!productArr[i].price || isNaN(productArr[i].price)) {
                status.badRequestStatus(res, 'Price is required')
            }
            if (!productArr[i].stock || isNaN(productArr[i].stock)) {
                status.badRequestStatus(res, 'Stock is required')
            }
            if (productArr[i].tags.length === 0) {
                status.badRequestStatus(res, 'Tags is required')
            }
        }
        const newProducts = productArr.map(product => {
            return {
                _id: new mongoose.Types.ObjectId(),
                title: product.title,
                price: product.price,
                stock: product.stock,
                tags: product.tags,
                description: product.description,
            }
        })
        const createdProducts = await productModel.insertMany(newProducts)
        status.successCreateStatus(res, createdProducts, 'Create new products successfully')
    } catch (error) {
        status.errorStatus(res, error)
    }
}

// create new product
const updateProduct = async (req, res) => {
    try {
        const productId = req.params.productId
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            status.badRequestStatus(res, 'Product Id is invalid')
        }
        const updatedProduct = await productModel.findByIdAndUpdate(productId, req.body)
        if (updatedProduct) {
            status.successStatus(res, await productModel.findById(productId), 'Update product by id successfully')
        } else {
            status.notFoundStatus(res, notFoundProduct)
        }
    } catch (error) {
        status.errorStatus(res, error)
    }
}

const deleteProduct = async (req, res) => {
    try {
        const productId = req.params.productId
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            status.badRequestStatus(res, 'Product Id is invalid')
        }
        const updatedProduct = await productModel.findByIdAndUpdate(productId, { isDeleted: true })
        if (updatedProduct) {
            status.successStatus(res, await productModel.findById(productId), 'Soft delete product successfully')
        } else {
            status.notFoundStatus(res, notFoundProduct)
        }
    } catch (error) {
        status.errorStatus(res, error)
    }
}


module.exports = {
    getAllProducts,
    getProductById,
    createProducts,
    updateProduct,
    deleteProduct
}