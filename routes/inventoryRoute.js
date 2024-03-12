const express = require('express')
const router = new express.Router()
const invController = require('../controllers/invController')
const utils = require('../utilities')


router.get("/type/:classification_id", utils.handleErrors(invController.buildByClassificationId));


// route to build inventory detail view
router.get("/detail/:inv_id",utils.handleErrors(invController.buildDetailView));

//route to build/deliver management view
router.get("/inv", utils.handleErrors(invController.buildInventory))

// router.get("/error/", utils.handleErrors(invController.errorRoute))

module.exports = router;