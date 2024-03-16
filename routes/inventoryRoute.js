const express = require('express')
const router = new express.Router()
const utils = require('../utilities')
const invController = require('../controllers/invController')
const iValidate = require('../utilities/inventory-validation')


router.get("/type/:classification_id", utils.handleErrors(invController.buildByClassificationId));


// route to build inventory detail view
router.get("/detail/:inv_id", utils.handleErrors(invController.buildDetailView));

//route to build/deliver management view

router.get("/inv", utils.handleErrors(invController.buildInventory));

// Route to  Managementview

router.get('/', utils.handleErrors(invController.createManagement));

router.get('/add-classification', utils.handleErrors(invController.buildNewClassView));

router.get('/add-inventory', utils.handleErrors(invController.buildAddInventoryView));

router.get('/deleteItem', utils.handleErrors(invController.deleteItemView));

router.get("/getInventory/:classification_id", utils.handleErrors(invController.getInventoryJSON))


//GET ACCOUNT DATA

router.post(
    "/add-classification",
    utils.handleErrors(invController.registerNewClass))

router.post(
    "/add-inventory",
    iValidate.inventoryRules(),
    iValidate.validateInventory,
    utils.handleErrors(invController.registerNewInventory))

// router.post(
//     "/deleteItem",
//     utils.handleErrors(invController.deleteItem)
// )


router.get("/error", utils.handleErrors(invController.errorRoute))

module.exports = router;