const express = require('express')
const router = new express.Router()
const utils = require('../utilities')
const accController = require('../controllers/accController')
const regValidate = require('../utilities/account-vallidation')
// const { updateAccountData, changePassword } = require('../models/account-model')





// Deliver Login View, by getting login path and using the buidLogin function
router.get("/login", utils.handleErrors( accController.buildLogin))

// Deliver  Register Form
router.get("/register",utils.handleErrors(accController.buildRegister))

// DELIVER UPDATE INFO PAGE
router.get('/update-user/:account_id', utils.handleErrors(accController.buildUpdateUser))

// router.get('/update-password/:account_id', utils.handleErrors(accController.buildUpdateUser))

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

// PROCEES UPDATE INFORMATION
router.post("/update-user",
regValidate.updateRules(),
regValidate.checkUpdateData,
 utils.handleErrors(accController.updateAccount))

 router.post("/update-password",
 regValidate.updatePassRules(),
 regValidate.checkUpdatePass,
 utils.handleErrors(accController.updatePassword)
 )

// LOGOUT ROUTE
 router.get('/logout', (req, res) => {
  res.clearCookie('jwt')
  res.redirect('/')
  req.flash("notice", "You have been logged out")
 })
// .post('/update-user', utils.handleErrors(accController.changePassword))

module.exports = router;