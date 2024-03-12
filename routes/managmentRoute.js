const express = require('express')
const router = new express.Router()
const utils = require('../utilities')
const managementController = require('../controllers/managementController')



router.get('/', utils.handleErrors(managementController.createManagement))

router.get('/add-classification', utils.handleErrors(managementController.buildNewClassView));

router.get('/add-inventory', utils.handleErrors(managementController.buildAddInventoryView));

// Get Account Data
router.post(
    "/add-classification",
    // regValidate.registationRules(),
    // regValidate.checkRegData,
    utils.handleErrors(managementController.newClass))


module.exports = router;