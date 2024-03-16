const express = require('express')
const router = new express.Router()
const utils = require('../utilities')
const accController = require('../controllers/accController')
const regValidate = require('../utilities/account-vallidation')





// Deliver Login View, by getting login path and using 
router.get("/login", utils.handleErrors( accController.buildLogin))

// Deliver  Register Form
router.get("/register",utils.handleErrors(accController.buildRegister))

// DELIVER ACCOUNT-MANAGEMENT VIEW

router.get("/account",
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
    utils.handleErrors(accController.accountLogin)
  )

  // router.post(
  //   "/account-management",
  //   utils.handleErrors(acc)
  // )

module.exports = router;