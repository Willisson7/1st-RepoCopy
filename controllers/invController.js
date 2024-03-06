const invModel = require("../models/inventory-model")
const utilities = require("../utilities")

const invCont = {}

// Build inventory by classification view

invCont.buildByClassificationId = async function (req, res, next) {
    try{
    const classification_id = req.params.classification_id;
    const data = await invModel.getInventoryByClassificationId(classification_id);
    if (!data || data.length === 0) {
        baseController.handleRedirect(res, "/");
        return;
    }

        const grid = await utilities.buildClassificationGrid(data)
        let nav = await utilities.getNav()
        const className = data[0].classification_name
        res.render("./inventory/classification", {
            title: className + " vehicles",
            nav,
            grid,
            errors: null,
        })
    } catch (error) {
        res.status(404).send("No data found for classification Id");
    }
}
// Build inventory by inventory id
invCont.buildDetailView = async function (req, res, next) {
    const inv_id = req.params.inv_id;
    const data = await invModel.getInventoryById(inv_id);
    if (data) {
        const grid = await utilities.buildDetailView(data)
        console.log('Eyes here!!', grid)
        let nav = await utilities.getNav()
        const title = data.inv_make + " " + data.inv_model
        console.log('look here', title)
        res.render("./inventory/detail", {
            title: title,
            nav,
            grid,
            errors: null,
        })

    } else {
        res.status(404).send("No data found for inventory Id");
    }
}




module.exports = invCont;