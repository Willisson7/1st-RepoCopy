const invModel = require("../models/inventory-model")
const utilities = require("../utilities")

const invCont = {}

// Build inventory by classification view

invCont.buildByClassificationId = async function (req, res, next) {
    const classification_id = req.params.classification_id;
    const data = await invModel.getInventoryByClassificationId(classification_id);


   if (data && data.length > 0){ 
    const grid = await utilities.buildClassificationGrid(data)
    let nav = await utilities.getNav()
    const className = data[0].classification_name
    res.render("./inventory/classification", {
        title: className + " vehicles",
        nav,
        grid,
    })
}else {
    res.status(404).send("No data found for classification Id");
}
}


module.exports = invCont;