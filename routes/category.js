const express = require('express');
const auth = require('../middleware/auth');
const isAdmin = require('../middleware/admin');
const {
    saveCategory,
    updateCategory,
    deleteCategory,
    findCategory,
    listCategory,
     } = require('../controllers/category');
const router = new express.Router();

router.get('/category', listCategory);
router.get('/category/:id', findCategory);
router.post('/category', auth, isAdmin, saveCategory);
router.patch('/category/:id', auth, updateCategory);
router.delete('/category/:id', auth, deleteCategory);

module.exports = router;