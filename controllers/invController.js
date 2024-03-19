
const invModel = require("../models/inventory-model")
const utilities = require("../utilities")

const invCont = {}

// Build inventory by classification view
invCont.buildByClassificationId = async function (req, res, next) {
    try {
        const classification_id = req.params.classification_id;
        const data = await invModel.getInventoryByClassificationId(classification_id);
        if (!data || data.length === 0) {
            baseController.handleRedirect(res, "/");
            return;
        }

        const grid = await utilities.buildClassificationGrid(data)
        let nav = await utilities.getNav()
        const className = data[0].classification_name
        res.render("inventory/classification", {
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

        let nav = await utilities.getNav()
        const title = data.inv_make + " " + data.inv_model

        res.render("inventory/detail", {
            title: title,
            nav,
            grid,
            errors: null,
        })

    } else {
        res.status(404).send("No data found for inventory Id");
    }
}

// BUILD VEHICLE MANAGEMENT VIEW
invCont.createManagement = async function (req, res, next) {
    let nav = await utilities.getNav()
    const classificationSelect = await utilities.buildClassificationList()
    req.flash("Notice", 'Sorry, there was an error processing the registration.')
    res.render('inventory/management', {
        title: "Vehicle Management",
        nav,
        errors: null,
        classificationSelect
    })
}

// DELIVER ADD CLASS VIEW FUNCTION
invCont.buildNewClassView = async function (req, res, next) {
    let nav = await utilities.getNav()
    req.flash("")
    res.render('inventory/add-classification', {
        title: "Vehicle Management",
        nav,
        errors: null,
    })
}

// DELIVER ADD_INVENTORY VIEW
invCont.buildAddInventoryView = async function (req, res, next) {
    let nav = await utilities.getNav()
    let classificationList = await utilities.buildClassificationList()
    req.flash("")
    res.render('inventory/add-inventory', {
        title: "Vehicle Management",
        nav,
        classificationList,
        errors: null,
    })
}

// PROCCESSING NEW CLASSIFICATION
invCont.registerNewClass = async function (req, res) {
    const { classification_name } = req.body
    const regResult = await invModel.registerNewClass(
        classification_name
    )

    let nav = await utilities.getNav()
    const classificationSelect = await utilities.buildClassificationList()
    if (regResult) {
        req.flash(
            "Notice",
            `Excellent! ${classification_name} successfully created.`
        )
        res.status(201).render('inventory/management', {
            title: 'Vehicle Management',
            nav,
            classificationSelect,
            errors: null
        })
    } else {
        const classificationSelect = await utilities.buildClassificationList()
        req.flash('Notice', 'Sorry, the classification could not be completed. =/')
        res.status(501).render("inventory/management", {
            title: "Vehicle Management",
            nav,
            classificationSelect,
            errors: null
        })
    }
}

// ADDING VEHICLE TO DATABASE
invCont.registerNewInventory = async function (req, res) {
    let nav = await utilities.getNav()
    const {
        classification_id,
        inv_make,
        inv_model,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_year,
        inv_miles,
        inv_color
    } = req.body
    const regResult = await invModel.registerNewInventory(
        classification_id,
        inv_make,
        inv_model,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_year,
        inv_miles,
        inv_color
    )
    if (regResult) {
        let classificationSelect = await utilities.buildClassificationList()
        req.flash(
            "Notice",
            `Excellent! Vechicle ${inv_make} ${inv_model} successfully added.`
        )
        res.status(201).render('inventory/management', {
            title: 'Inventory Management',
            nav,
            classificationSelect,
            errors: null,
        })
    } else {
        let classificationList = await utilities.buildClassificationList()
        req.flash('Notice', 'Sorry, the Vehicle could not be added. =/')
        res.status(501).render("inventory/add-inventory", {
            title: "Vehicle Managment",
            nav,
            classificationList,
            errors: null,

        })
    }

}

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
    const classification_id = parseInt(req.params.classification_id)
    const invData = await invModel.getInventoryByClassificationId(classification_id)
    if (invData[0].inv_id) {
        return res.json(invData)
    } else {
        next(new Error("No data returned"))
    }
}

//FUNCTION TO DELIVER INVENTORY EDIT PAGE
invCont.editInvView = async function (req, res, next) {
    const inv_id = parseInt(req.params.inv_id)
    let nav = await utilities.getNav()
    const itemData = await invModel.getInventoryById(inv_id)
    const classificationSelect = await utilities.buildClassificationList(itemData.classification_id)
    const itemName = `${itemData.inv_make} ${itemData.inv_model}`
    res.render("inventory/edit", {
        title: "Edit " + itemName,
        nav,
        classificationSelect: classificationSelect,
        errors: null,
        inv_id: itemData.inv_id,
        inv_make: itemData.inv_make,
        inv_model: itemData.inv_model,
        inv_year: itemData.inv_year,
        inv_description: itemData.inv_description,
        inv_image: itemData.inv_image,
        inv_thumbnail: itemData.inv_thumbnail,
        inv_price: itemData.inv_price,
        inv_miles: itemData.inv_miles,
        inv_color: itemData.inv_color,
        classification_id: itemData.classification_id
    })
}

/* ***************************
 *  Update Inventory Data
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
    let nav = await utilities.getNav()
    const {
        inv_id,
        inv_make,
        inv_model,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_year,
        inv_miles,
        inv_color,
        classification_id,
    } = req.body
    const updateResult = await invModel.updateInventory(
        inv_id,
        inv_make,
        inv_model,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_year,
        inv_miles,
        inv_color,
        classification_id
    )

    if (updateResult) {
        const itemName = updateResult.inv_make + " " + updateResult.inv_model
        req.flash("notice", `The ${itemName} was successfully updated.`)
        res.redirect("/inv/")
    } else {
        const classificationSelect = await utilities.buildClassificationList(classification_id)
        const itemName = `${inv_make} ${inv_model}`
        req.flash("notice", "Sorry, the insert failed.")
        res.status(501).render("inventory/edit", {
            title: "Edit " + itemName,
            nav,
            classificationSelect: classificationSelect,
            errors: null,
            inv_id,
            inv_make,
            inv_model,
            inv_year,
            inv_description,
            inv_image,
            inv_thumbnail,
            inv_price,
            inv_miles,
            inv_color,
            classification_id
        })
    }
}

// TO DO: WRITE OUT A FUNCTION TO DELIVER THE DELETE VIEW PAGE
// invCont.deleteItemView = async function(req, res, next){
//     let nav = await utilities.getNav()
//     req.flash("")
//     res.render(`/delete/${element.inv_id}`, {
//         title: "Delete Confirmation",
//         nav,
//         errors: null,
//     })
// }

// TO DO: WRITE OUT FUNCTION TO CARRY OUT DELETION

module.exports = invCont