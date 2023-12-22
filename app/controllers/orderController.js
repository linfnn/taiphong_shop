const statusAPI = require("../constants/constants");
const { default: mongoose } = require("mongoose");
const orderModel = require('../models/orderModel')
const notFoundOrder = 'Not found any order'
const accountModel = require('../models/accountModel')
// Get all order by tags, costMin, costMax, page, limit
const getAllOrders = async (req, res) => {
    try {
        const { accountId, page, limit, startDate, endDate, status, costMin, costMax } = req.query
        const condition = getConditionOrders(page, limit, costMin, costMax, await orderModel.find())
        if (accountId !== undefined && !mongoose.Types.ObjectId.isValid(accountId)) {
            statusAPI.badRequestStatus(res, 'Account id is invalid')
        }
        if (accountId || accountId !== '') {
            const orderOfAccountId = await accountModel.findById(accountId).populate('orders')
            const orderFound = orderOfAccountId?.orders.filter(order => order.isDeleted === false)
            foundOrderByConditions(res, orderFound, limit, page, status, condition)
        }
        if (accountId === undefined || accountId === '') {
            const orderFound = await orderModel
                .find({ isDeleted: false })
            foundOrderByConditions(res, orderFound, limit, page, status, condition)

        }
    } catch (error) {
        console.log(error)
        statusAPI.errorStatus(res, error)
    }
}

// Get order by id
const getOrderById = async (req, res) => {
    try {
        const orderId = req.params.orderId
        if (!mongoose.Types.ObjectId.isValid(orderId)) {
            statusAPI.badRequestStatus(res, 'order Id is invalid')
        }
        const orderList = await orderModel.find({ _id: orderId, isDeleted: false })
        // const isExistOrder = orderList.filter(order => order.isDeleted === false)
        if (orderList) {
            statusAPI.successStatus(res, orderList, 'Get order by id successfully')
        } else {
            statusAPI.notFoundStatus(res, notFoundOrder)
        }
    } catch (error) {
        statusAPI.errorStatus(res, error)
    }
}

// Hàm hỗ trợ thu thập điều kiện lọc danh sách sản phẩm
const getConditionOrders = (page, limit, costMin, costMax, orderList) => {
    if (!page) {
        page = 1
    }
    if (!limit) {
        limit = orderList.length
    }
    if (!costMin) {
        costMin = 0
    }
    if (!costMax) {
        var costMax = 0
        for (let i = 0; i < orderList.length; i++) {
            if (orderList[i].cost > costMax) {
                costMax = orderList[i].cost
            }
        }
        costMax = costMax
    }

    if (page || limit || costMin || costMax) {
        parseInt(page)
        parseInt(limit)
        parseInt(costMin)
        parseInt(costMax)
    }
    return {
        page,
        limit,
        costMin,
        costMax
    }
}
// Hàm hỗ trợ tìm order theo điều kiện đã lọc
const foundOrderByConditions = (res, orderFound, limit, page, status, condition) => {
    const orderFoundLength = orderFound !== undefined ? orderFound.length : 0
    const pagination = {
        total: orderFoundLength,
        perPage: limit,
        currentPage: page,
        page: Math.ceil(orderFoundLength / limit)
    }
    if (!status || status === undefined) {
        const orderList = orderFound?.filter(order => {
            return (
                condition.costMin <= order.cost &&
                condition.costMax >= order.cost
            )
        }).slice((condition.page - 1) * condition.limit, condition.page * condition.limit)
        if (orderList && orderList.length > 0) {
            statusAPI.successPaginationStatus(res, orderList, pagination, 'Get all orders with conditions successfully')
        } else {
            statusAPI.notFoundStatus(res, notFoundOrder)
        }
    }
    else {
        const orderList = orderFound.filter(order => {
            return (
                condition.costMin <= order.cost &&
                condition.costMax >= order.cost &&
                order.status.toLowerCase() === status.toLowerCase()
            )
        }).slice((condition.page - 1) * condition.limit, condition.page * condition.limit)
        if (orderList && orderList.length > 0) {
            statusAPI.successPaginationStatus(res, orderList, pagination, 'Get all orders with conditions successfully')
        } else {
            statusAPI.notFoundStatus(res, notFoundOrder)
        }
    }
}

// create new order
const createOrders = async (req, res) => {
    try {
        const { accountId, cost, receivingId } = req.body
        if (receivingId !== undefined && !mongoose.Types.ObjectId.isValid(receivingId)) {
            statusAPI.badRequestStatus(res, 'receiving id is invalid')
        }
        const newOrders = {
            _id: new mongoose.Types.ObjectId(),
            cost,
            shippedTo: receivingId
        }
        const createdOrders = await orderModel.create(newOrders)
        if (accountId !== undefined && !mongoose.Types.ObjectId.isValid(accountId)) {
            statusAPI.badRequestStatus(res, 'Account id is invalid')
        }
        if (accountId !== undefined) {
            // Thêm id vào orderDetails của order model
            await accountModel.findByIdAndUpdate(accountId, {
                $push: { orders: createdOrders._id }
            })
        }
        statusAPI.successCreateStatus(res, createdOrders, 'Create new orders successfully')
    } catch (error) {
        statusAPI.errorStatus(res, error)
    }
}

// create new order
const updateOrder = async (req, res) => {
    try {
        const orderId = req.params.orderId
        if (!mongoose.Types.ObjectId.isValid(orderId)) {
            statusAPI.badRequestStatus(res, 'order Id is invalid')
        }
        if (req.body.receivingId !== undefined && !mongoose.Types.ObjectId.isValid(req.body.receivingId)) {
            statusAPI.badRequestStatus(res, 'receiving id is invalid')
        }
        const updatedOrder = await orderModel.findByIdAndUpdate(orderId, req.body)
        if (updatedOrder) {
            statusAPI.successCreateStatus(res, await orderModel.findById(orderId), 'Update order by id successfully')
        } else {
            statusAPI.notFoundStatus(res, notFoundOrder)
        }
    } catch (error) {
        statusAPI.errorStatus(res, error)
    }
}

const deleteOrder = async (req, res) => {
    try {
        const orderId = req.params.orderId
        const accountId = req.params.accountId
        if (!mongoose.Types.ObjectId.isValid(orderId)) {
            statusAPI.badRequestStatus(res, 'order Id is invalid')
        }
        const updatedOrder = await orderModel.findByIdAndUpdate(orderId, { isDeleted: true })
        if (accountId || accountId !== undefined) {
            if (!mongoose.Types.ObjectId.isValid(accountId)) {
                statusAPI.badRequestStatus(res, 'account Id is invalid')
            } else {
                await orderModel.findByIdAndUpdate(accountId, {
                    $pull: { orders: orderId }
                })
            }
        }
        if (updatedOrder) {
            statusAPI.successCreateStatus(res, await orderModel.findById(orderId), 'Soft delete order successfully')
        } else {
            statusAPI.notFoundStatus(res, notFoundOrder)
        }
    } catch (error) {
        statusAPI.errorStatus(res, error)
    }
}


module.exports = {
    getAllOrders,
    getOrderById,
    createOrders,
    updateOrder,
    deleteOrder
}