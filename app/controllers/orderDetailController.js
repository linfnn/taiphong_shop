const status = require("../constants/constants");
const { default: mongoose } = require("mongoose");
const orderDetailModel = require('../models/orderDetailModel')
const orderModel = require('../models/orderModel')
const notFoundOrderDetail = 'Not found any orderDetail'

// Get all orderDetail by tags, priceMin, priceMax, page, limit
const getAllOrderDetails = async (req, res) => {
    try {
        const orderId = req.query.orderId
        if (orderId !== undefined && !mongoose.Types.ObjectId.isValid(orderId)) {
            status.badRequestStatus(res, 'Order Id is invalid')
        }
        if (orderId === undefined || orderId === '') {
            const orderDetailList = await orderDetailModel.find()
            if (orderDetailList && orderDetailList.length > 0) {
                status.successStatus(res, orderDetailList, 'Get all orderDetails successfully')
            } else {
                status.notFoundStatus(res, notFoundOrderDetail)
            }
        } else {
            const orderInfo = await orderModel.findById(orderId).populate('orderDetails')
            if (orderInfo && orderInfo.length > 0) {
                status.successStatus(res, orderInfo, 'Get all orderDetails of order successfully')
            } else {
                status.notFoundStatus(res, notFoundOrderDetail)
            }

        }
    } catch (error) {
        status.errorStatus(res, error)
    }
}

// Get orderDetail by id
const getOrderDetailById = async (req, res) => {
    try {
        const orderDetailId = req.params.orderDetailId
        if (!mongoose.Types.ObjectId.isValid(orderDetailId)) {
            status.badRequestStatus(res, 'orderDetail Id is invalid')
        }
        const orderDetailList = await orderDetailModel.findById(orderDetailId)
        if (orderDetailList) {
            status.successStatus(res, orderDetailList, 'Get orderDetail by id successfully')
        } else {
            status.notFoundStatus(res, notFoundOrderDetail)
        }
    } catch (error) {
        status.errorStatus(res, error)
    }
}

// create new orderDetail
const createOrderDetails = async (req, res) => {
    try {
        const { orderId, productArr } = req.body
        // [{ productId: 'aa', quantity: 3 }, { productId: 'bb', quantity: 4 }]
        if (orderId !== undefined && !mongoose.Types.ObjectId.isValid(orderId)) {
            status.badRequestStatus(res, 'Order id is invalid')
        }
        for (let i = 0; i < productArr.length; i++) {
            if (!mongoose.Types.ObjectId.isValid(productArr[i].productId)) {
                status.badRequestStatus(res, 'product id is invalid')
            }
            if (isNaN(productArr[i].quantity) || productArr[i].quantity < 0) {
                status.badRequestStatus(res, 'quantity must be positive integers')
            }
        }
        const newOrderDetails = productArr.map(detail => {
            return {
                _id: new mongoose.Types.ObjectId(),
                productId: detail.productId,
                quantity: detail.quantity
            }
        })
        const createdOrderDetails = await orderDetailModel.insertMany(newOrderDetails)
        // Thêm id vào orderDetails của order model
        const updatedOrderDetail = await orderModel.findByIdAndUpdate(orderId, {
            $push: { orderDetails: { $each: createdOrderDetails.map(detail => detail._id) } }
        })
        // Xét tồn kho và trừ số lượng tồn kho
        for (let i = 0; i < newOrderDetails.length; i++) {
            let productId = newOrderDetails[i].productId
            let productFound = await productModel.findById(productId)
            let amountProduct = productFound.stock
            if (amountProduct < newOrderDetails[i].quantity) {
                return status.badRequestStatus(res, `Sản phẩm ${productFound.name} không đủ số lượng để đặt hàng.`)
            } else {
                var updatedProduct = await productModel.findByIdAndUpdate(productId, { amount: amountProduct - newOrderDetails[i].quantity })
            }
        }
        // status.successCreateStatus(res, createdOrderDetails, 'Create new orderDetails successfully')
        return res.status(201).json({
            status: 'Create new orderDetails successfully',
            order: updatedOrderDetail,
            data: createdOrderDetails,
            updatedProduct
        })

    } catch (error) {
        status.errorStatus(res, error)
    }
}

// create new orderDetail
const updateOrderDetail = async (req, res) => {
    try {
        const orderDetailId = req.params.orderDetailId
        if (!mongoose.Types.ObjectId.isValid(orderDetailId)) {
            status.badRequestStatus(res, 'orderDetail Id is invalid')
        }
        const updatedOrderDetail = await orderDetailModel.findByIdAndUpdate(orderDetailId, req.body)
        if (updatedOrderDetail) {
            status.successCreateStatus(res, await orderDetailModel.findById(orderDetailId), 'Update orderDetail by id successfully')
        } else {
            status.notFoundStatus(res, notFoundOrderDetail)
        }
    } catch (error) {
        status.errorStatus(res, error)
    }
}

const deleteOrderDetail = async (req, res) => {
    try {
        const orderDetailId = req.params.orderDetailId
        const orderId = req.params.orderId
        if (!mongoose.Types.ObjectId.isValid(orderDetailId)) {
            status.badRequestStatus(res, 'orderDetail Id is invalid')
        }
        const deletedOrderDetail = await orderDetailModel.findByIdAndDelete(orderDetailId)
        if (orderId || orderId !== undefined) {
            if (!mongoose.Types.ObjectId.isValid(orderId)) {
                status.badRequestStatus(res, 'order Id is invalid')
            } else {
                await orderModel.findByIdAndUpdate(orderId, {
                    $pull: { orderDetails: orderDetailId }
                })
            }
        }
        if (deletedOrderDetail) {
            status.successCreateStatus(res, deletedOrderDetail, 'Delete orderDetail successfully')
        } else {
            status.notFoundStatus(res, notFoundOrderDetail)
        }
    } catch (error) {
        status.errorStatus(res, error)
    }
}


module.exports = {
    getAllOrderDetails,
    getOrderDetailById,
    createOrderDetails,
    updateOrderDetail,
    deleteOrderDetail
}