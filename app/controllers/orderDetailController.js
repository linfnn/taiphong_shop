const status = require("../constants/constants");
const { default: mongoose } = require("mongoose");
const orderDetailModel = require('../models/orderDetailModel')
const notFoundOrderDetail = 'Not found any orderDetail'

// Get all orderDetail by tags, priceMin, priceMax, page, limit
const getAllOrderDetails = async (req, res) => {
    try {
        const orderDetailList = await orderDetailModel.find()
        if (orderDetailList && orderDetailList.length > 0) {
            status.successStatus(res, orderDetailList, 'Get all orderDetails successfully')
        } else {
            status.notFoundStatus(res, notFoundOrderDetail)
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
        if (orderDetailList && orderDetailList.length > 0) {
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
        const { productArr } = req.body
        // [{ productId: 'aa', quantity: 3 }, { productId: 'bb', quantity: 4 }]
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
        status.successCreateStatus(res, createdOrderDetails, 'Create new orderDetails successfully')
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
        if (updatedOrderDetail && updatedOrderDetail.length > 0) {
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
        if (deletedOrderDetail && deletedOrderDetail.length > 0) {
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