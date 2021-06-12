
const express = require('express')
const router = new express.Router()
const { contactUsValidator } = require('../validator');

const { contactUs } = require('../controllers/contact')

router.post('/contact', contactUsValidator, contactUs)
  
module.exports = router