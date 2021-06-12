const express = require('express')
const router = new express.Router()
const auth = require('../middleware/auth')
const admin = require('../middleware/admin')
const email = require('../middleware/email')

const {
    userProfile,  
    getUser,
    getUsers,
    updateUser,
    verifyEmail
} = require('../controllers/user')
const { route } = require('./auth')

router.get('/users/:id', auth, getUser);
router.get('/users/me', auth, userProfile)
router.get('/users', auth, getUsers)
router.patch('/users/me', auth, updateUser)
router.get("/verify/:email/:token", email, verifyEmail)

module.exports = router