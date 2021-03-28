const express = require("express")
const router = express.Router()
const auth = require('../middleware/auth')

const {getCompany, updateCompany} = require("../controllers/company")
const { companyValidator } = require("../validator")

router.get("/company", auth, getCompany)
router.patch("/company", auth, updateCompany)

module.exports = router;