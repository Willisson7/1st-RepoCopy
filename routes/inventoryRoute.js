const express = require('express')
const router = new express.Router()
const invController = require('../controllers/invController')
const utils = require('../utilities')


router.get("/type/:classification_id", utils.handleErrors(invController.buildByClassificationId));


// route to build inventory detail view
router.get("/detail/:inv_id", utils.handleErrors(invController.buildDetailView));

//route to build/deliver management view

router.get("/inv", utils.handleErrors(invController.buildInventory));


router.get('/', utils.handleErrors(invController.createManagement));

router.get('/add-classification', utils.handleErrors(invController.buildNewClassView));

router.get('/add-inventory', utils.handleErrors(invController.buildAddInventoryView));

// Get Account Data

router.post(
    "/add-classification",
    // regValidate.registationRules(),
    // regValidate.checkRegData,
    utils.handleErrors(invController.registerNewClass))

router.post(
    "/add-inventory",
    // regValidate.registationRules(),
    // regValidate.checkRegData,
    utils.handleErrors(invController.registerNewInventory))



router.get("/error", utils.handleErrors(invController.errorRoute))

module.exports = router;