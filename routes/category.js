const express = require('express');
const auth = require('../middleware/auth');
const {
    // saveCategory,
    findCategory,
    listCategory,
     } = require('../controllers/category');
const router = new express.Router();

// router.post('/category', auth, saveCategory);
router.get('/category', listCategory);
router.get('/category/:id', findCategory);

module.exports = router;