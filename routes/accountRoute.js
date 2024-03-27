const express = require('express')
const router = new express.Router()
const utils = require('../utilities')
const accController = require('../controllers/accController')
const regValidate = require('../utilities/account-vallidation')
const { updateAccount } = require('../models/account-model')





// Deliver Login View, by getting login path and using the buidLogin function
router.get("/login", utils.handleErrors( accController.buildLogin))

// Deliver  Register Form
router.get("/register",utils.handleErrors(accController.buildRegister))

// DELIVER UPDATE INFO VIEW
router
.get('/update-user', utils.handleErrors(accController.buildUpdateUser))
// PROCEES UPDATE INFORMATION
.post('/update-user', utils.handleErrors(accController.updateAccount))

// DELIVER ACCOUNT-MANAGEMENT VIEW
router.get("/account-management/",
utils.checkLogin,
utils.handleErrors(accController.buildManagementView))

// Get Account Data
router.post(
    "/register",
    regValidate.registationRules(),
    regValidate.checkRegData,
    regValidate.checkExistingEmail,
    utils.handleErrors(accController.registerAccount))


// Process the login attempt
router.post(
    "/login",
    regValidate.loginRules(),
    regValidate.checkLoginData,
    utils.handleErrors(accController.accountLogin),
  )



module.exports = router;