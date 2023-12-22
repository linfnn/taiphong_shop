const express = require("express");
const { getAllOrderDetails, getOrderDetailById, createOrderDetails, updateOrderDetail, deleteOrderDetail } = require("../controllers/orderDetailController");
const orderDetailRouter = express.Router();

orderDetailRouter.get('/orderDetails', getAllOrderDetails)
orderDetailRouter.get('/orderDetails/:orderDetailId', getOrderDetailById)
orderDetailRouter.post('/orderDetails', createOrderDetails)
orderDetailRouter.put('/orderDetails/:orderDetailId', updateOrderDetail)
orderDetailRouter.delete('/orderDetails/:orderDetailId/:orderId', deleteOrderDetail)

module.exports = { orderDetailRouter }