const express = require("express");
const { getAllProductTags, getProductTagById, createProductTag, updateProductTag, deleteProductTag } = require("../controllers/productTagController");
const productTagRouter = express.Router();

productTagRouter.get('/productTags', getAllProductTags)
productTagRouter.get('/productTags/:productTagId', getProductTagById)
productTagRouter.post('/productTags', createProductTag)
productTagRouter.put('/productTags/:productTagId', updateProductTag)
productTagRouter.delete('/productTags/:productTagId', deleteProductTag)

module.exports = { productTagRouter }