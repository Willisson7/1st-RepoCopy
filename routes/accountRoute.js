const express = require('express')
const router = new express.Router()
const utils = require('../utilities')
const accController = require('../controllers/accController')





// Deliver Login View, by getting login path and using 
router.get("/login", utils.handleErrors( accController.buildLogin))

// Deliver Registration View
router.get("/registration",utils.handleErrors(accController.buildRegister))

// Get Account Data
router.post("/registration",utils.handleErrors(accController.registerAccount))



module.exports = router;