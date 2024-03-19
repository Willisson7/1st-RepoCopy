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

// NEED TO ADD utils.checkAccountType.
router.get("/getInventory/:classification_id", utils.handleErrors(invController.getInventoryJSON))

// DELIVER INVENTORY ITEM EDIT PAGE
router.get('/edit/:inv_id', utils.handleErrors(invController.editInvView))

router.get('/delete/:inv_id', utils.handleErrors(invController.deleteItemView));


// ROUTE FOR ADDING AND PROCESSING NEW CLASSIFICATION
router
    .get('/add-classification', utils.handleErrors(invController.buildNewClassView))
    .post(
    "/add-classification",
    iValidate.addClassificationRules(),
    iValidate.checkClassificationData,
    utils.handleErrors(invController.registerNewClass))

// ROUTE FOR ADDING AND PROCESSING NEW VEHICLES
router
    .get('/add-inventory', utils.handleErrors(invController.buildAddInventoryView))
    .post(
    "/add-inventory",
    iValidate.inventoryRules(),
    iValidate.checkInvData,
    utils.handleErrors(invController.registerNewInventory))

//ROUTE TO PROCESS INVENTORY UPDATES
router.post("/update/",
// iValidate.newInvRules,
// iValidate.checkUpdateData,
utils.handleErrors(invController.updateInventory))

// ROUTE TO DELETE ITEMS FROM INVENTORY
router.post(
    "/delete/:inv_id",
    utils.handleErrors(invController.deleteItem)
)


router.get("/error", utils.handleErrors(invController.errorRoute))

module.exports = router;