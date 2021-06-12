const express = require('express');
// const multer = require('multer');
const auth = require('../middleware/auth');
const {
    listProduct,
    getProductById,  
    createProduct,
    updateProduct,
    productById,
    deleteProductById } = require('../controllers/product');
const { productValidator } = require('../validator')
const router = new express.Router();

// const upload = multer({
//     limits: {
//         fileSize: 2000000
//     },
//     fileFilter(req, file, next) {
//         if(!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
//             return next(new Error('Please upload an image.'));
//         }
//         next(undefined, true);
//     }
// })

router.get('/product', auth, listProduct);
router.get('/product/:productId', getProductById);
// router.post('/product', upload.single('image'), createProduct, (error, req, res, next) => {
//     res.status(400).send({error: error.message});
// });
router.post("/product", auth, productValidator, createProduct)
router.patch('/product/:productId', auth, productValidator, updateProduct);
router.delete('/product/:productId', auth, deleteProductById);

router.param("productId", productById);

module.exports = router;