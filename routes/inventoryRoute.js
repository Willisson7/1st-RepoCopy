const express = require('express')
const router = new express.Router()
const invController = require('../controllers/invController')


router.get("/type/:classification_id", invController.buildByClassificationId);


// route to build inventory detail view
router.get("/detail/:inv_id", invController.buildDetailView);

module.exports = router;