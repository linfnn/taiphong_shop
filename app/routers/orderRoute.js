const express = require("express");
const { getAllOrders, getOrderById, createOrders, updateOrder, deleteOrder } = require("../controllers/orderController");
const orderRouter = express.Router();

orderRouter.get('/orders', getAllOrders)
orderRouter.get('/orders/:orderId', getOrderById)
orderRouter.post('/orders', createOrders)
orderRouter.put('/orders/:orderId', updateOrder)
orderRouter.delete('/orders/:orderId/:accountId', deleteOrder)

module.exports = { orderRouter }