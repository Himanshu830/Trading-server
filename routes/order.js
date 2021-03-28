const express = require('express');
// const multer = require('multer');
const auth = require('../middleware/auth');
const {
    listOrder,
    getOrderById,
    createOrder,
    orderById,
    updateOrder,
    deleteOrderById } = require('../controllers/order');
const { orderValidator } = require('../validator');
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

router.get('/order', auth, listOrder);
router.get('/order/:orderId', auth, getOrderById);
// router.post('/product', upload.single('image'), createProduct, (error, req, res, next) => {
//     res.status(400).send({error: error.message});
// });
router.post("/order", auth, orderValidator, createOrder)
router.patch('/order/:orderId', auth, orderValidator, updateOrder);
router.delete('/order/:orderId', auth, deleteOrderById);

router.param("orderId", orderById);

module.exports = router;