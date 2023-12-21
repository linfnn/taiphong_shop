// const status = require("../constants/constants");
// const { default: mongoose } = require("mongoose");
// const orderModel = require('../models/orderModel')
// const notFoundOrder = 'Not found any order'

// // Get all product by tags, priceMin, priceMax, page, limit
// const getAllOrders = async (req, res) => {
//     try {
//         const { accountId, page, limit, startDate, endDate, status, cost } = req.query
//         const condition = getConditionOrders(page, limit, startDate, endDate, status, cost, await orderModel.find())
//         const totalProduct = await orderModel.find({ isDeleted: false })
//         const pagination = {
//             total: totalProduct.length,
//             perPage: limit,
//             currentPage: page,
//             page: Math.ceil(totalProduct.length / limit)
//         }
//         const productFound = await orderModel
//             .find({ isDeleted: false })
//             // .sort({ isDeleted: false })
//             .skip((condition.page - 1) * condition.limit)
//             .limit(condition.limit)

//         if (!tags || tags === undefined) {
//             const productList = productFound.filter(product => {
//                 return (
//                     condition.priceMin <= product.price &&
//                     condition.priceMax >= product.price
//                 )
//             })
//             if (productList && productList.length > 0) {
//                 status.successPaginationStatus(res, productList, pagination, 'Get all products with conditions successfully')
//             } else {
//                 status.notFoundStatus(res, notFoundOrder)
//             }
//         }
//         else {
//             const productList = productFound.filter(product => {
//                 return (
//                     condition.priceMin <= product.price &&
//                     condition.priceMax >= product.price &&
//                     product.tags.includes(tags)
//                 )
//             })
//             if (productList && productList.length > 0) {
//                 status.successPaginationStatus(res, productList, pagination, 'Get all products with conditions successfully')
//             } else {
//                 status.notFoundStatus(res, notFoundOrder)
//             }
//         }

//     } catch (error) {
//         status.errorStatus(res, error)
//     }
// }

// // Get product by id
// const getProductById = async (req, res) => {
//     try {
//         const productId = req.params.productId
//         if (!mongoose.Types.ObjectId.isValid(productId)) {
//             status.badRequestStatus(res, 'Product Id is invalid')
//         }
//         const productList = await orderModel.findById(productId)
//         // const isExistProduct = productList.filter(product => product.isDeleted === false)
//         if (productList && productList.length > 0) {
//             status.successStatus(res, productList, 'Get product by id successfully')
//         } else {
//             status.notFoundStatus(res, notFoundOrder)
//         }
//     } catch (error) {
//         status.errorStatus(res, error)
//     }
// }

// // Hàm hỗ trợ thu thập điều kiện lọc danh sách sản phẩm
// const getConditionOrders = (page, limit, startDate, endDate, status, cost, productList) => {
//     if (!page) {
//         page = 1
//     }
//     if (!limit) {
//         limit = productList.length
//     }
//     if (!cost) {

//     }
//     // if (!priceMin) {
//     //     priceMin = 0
//     // }
//     // if (!priceMax) {
//     //     var priceMax = 0
//     //     for (let i = 0; i < productList.length; i++) {
//     //         if (productList[i].price > priceMax) {
//     //             priceMax = productList[i].price
//     //         }
//     //     }
//     //     priceMax = priceMax
//     // }

//     if (page || limit || cost) {
//         parseInt(page)
//         parseInt(limit)
//         parseInt(cost)
//     }
//     return {
//         page,
//         limit,
//         priceMin,
//         priceMax
//     }
// }

// // create new product
// const createProducts = async (req, res) => {
//     try {
//         // const { title, price, stock, tags, description } = req.body
//         for (let i = 0; i < req.body.length; i++) {
//             const isUnique = await orderModel.find({ title: req.body[i].title })
//             if (!req.body[i].title || isUnique.length !== 0) {
//                 status.badRequestStatus(res, 'Title is required & must be unique value')
//             }
//             if (!req.body[i].price || isNaN(req.body[i].price)) {
//                 status.badRequestStatus(res, 'Price is required')
//             }
//             if (!req.body[i].stock || isNaN(req.body[i].stock)) {
//                 status.badRequestStatus(res, 'Stock is required')
//             }
//             if (req.body[i].tags.length === 0) {
//                 status.badRequestStatus(res, 'Tags is required')
//             }
//         }
//         const newProducts = req.body.map(product => {
//             return {
//                 _id: new mongoose.Types.ObjectId(),
//                 title: product.title,
//                 price: product.price,
//                 stock: product.stock,
//                 tags: product.tags,
//                 description: product.description,
//             }
//         })
//         const createdProducts = await orderModel.insertMany(newProducts)
//         status.successCreateStatus(res, createdProducts, 'Create new products successfully')
//     } catch (error) {
//         status.errorStatus(res, error)
//     }
// }

// // create new product
// const updateProduct = async (req, res) => {
//     try {
//         const productId = req.params.productId
//         if (!mongoose.Types.ObjectId.isValid(productId)) {
//             status.badRequestStatus(res, 'Product Id is invalid')
//         }
//         const updatedProduct = await orderModel.findByIdAndUpdate(productId, req.body)
//         if (updatedProduct && updatedProduct.length > 0) {
//             status.successCreateStatus(res, await orderModel.findById(productId), 'Update product by id successfully')
//         } else {
//             status.notFoundStatus(res, notFoundOrder)
//         }
//     } catch (error) {
//         status.errorStatus(res, error)
//     }
// }

// const deleteProduct = async (req, res) => {
//     try {
//         const productId = req.params.productId
//         if (!mongoose.Types.ObjectId.isValid(productId)) {
//             status.badRequestStatus(res, 'Product Id is invalid')
//         }
//         const updatedProduct = await orderModel.findByIdAndUpdate(productId, { isDeleted: true })
//         if (updatedProduct && updatedProduct.length > 0) {
//             status.successCreateStatus(res, await orderModel.findById(productId), 'Soft delete product successfully')
//         } else {
//             status.notFoundStatus(res, notFoundOrder)
//         }
//     } catch (error) {
//         status.errorStatus(res, error)
//     }
// }


// module.exports = {
//     getAllProducts: getAllOrders,
//     getProductById,
//     createProducts,
//     updateProduct,
//     deleteProduct
// }