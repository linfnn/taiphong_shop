const express = require("express");
const { createProducts, getAllProducts, getProductById, updateProduct, deleteProduct } = require("../controllers/productController");
const productRouter = express.Router();

productRouter.get('/products', getAllProducts)
productRouter.get('/products/:productId', getProductById)
productRouter.post('/products', createProducts)
productRouter.put('/products/:productId', updateProduct)
productRouter.delete('/products/:productId', deleteProduct)

module.exports = { productRouter }