const express = require('express')
const router = new express.Router()
const utils = require('../utilities')
const accController = require('../controllers/accController')
const regValidate = require('../utilities/account-vallidation')





// Deliver Login View, by getting login path and using 
router.get("/login", utils.handleErrors( accController.buildLogin))

// Deliver  View
router.get("/register",utils.handleErrors(accController.buildRegister))



// Get Account Data
router.post(
    "/register",
    regValidate.registationRules(),
    //  regValidate.checkRegData(),
    //  regValidate.checkExistingEmail(),
    utils.handleErrors(accController.registerAccount))


// Process the login attempt
router.post(
    "/login",
    (req, res) => {
      res.status(200).send('login process')
    }
  )

module.exports = router;