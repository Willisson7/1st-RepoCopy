const invModel = require("../models/inventory-model")
const managementModel = require('../models/managementModel')
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
// BUILD MANAGEMENT VIEW

invCont.createManagement = async function (req, res, next) {
    let nav = await utilities.getNav()
    req.flash("Notice", 'Sorry, there was an error processing the registration.')
    res.render('inventory/management', {
        title: "Vehicle Management",
        nav,
        errors: null,
    })
}


// DELIVER ADD CLASS VIEW FUNCTION

invCont.buildNewClassView = async function (req, res, next) {
    let nav = await utilities.getNav()
    req.flash("notice", "This is a flash message.")
    res.render('inventory/add-classification', {
        title: "Vehicle Management",
        nav,
        errors: null,
    })
}


// DELIVER ADD_INVENTORY VIEW

invCont.buildAddInventoryView = async function (req, res, next) {
    let nav = await utilities.getNav()
    req.flash("notice", "This is a flash message.")
    res.render('inventory/add-inventory', {
        title: "Vehicle Management",
        nav,
        errors: null,
    })
}

// Processing Registration


invCont.registerNewClass = async function (req, res) {
    let nav = await utilities.getNav()
    const {
        classification_name
    } = req.body
    const regResult = await managementModel.registerNewClass(
        classification_name
    )
    if (regResult) {
        req.flash(
            "Notice",
            `Excellent! ${classification_name} successfully created.`
        )
        res.status(201).render('./inventory/management', {
            title: 'Vehicle Management',
            nav,
            errors: null,
        })
    } else {
        req.flash('Notice', 'Sorry, the registration failed. =/')
        res.status(501).render("./inventory/management", {
            title: "Vehicle Managment",
            nav,
            errors: null,
        })
    }
}

// TO DO: Modify this to registerNewInventory

invCont.registerNewInventory = async function (req, res) {
    console.log('Look Here!')
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

    // BEGINNING SERVER_SIDE VALIDATE
    let errors = [];

    // VALIDATE ALL REQUIRED FIELDS
    if (!classification_id || !inv_make || !inv_model || !inv_description || !inv_image || !inv_thumbnail || !inv_price || !inv_year || !inv_miles || !inv_color) {
        errors.push("All fields are required.");

        // VALIDATE PRICE (DECIMAL OR INTEGER)
        if (!/^\d+(\.\d+)?$/.test(inv_price)) {
            errors.push("Price must be a valid decimal or integer.");
        }

        // VALIDATE YEAR (4-DIGIT NUMBER)
        if (!/^\d{4}$/.test(inv_year)) {
            errors.push("Year must be a 4-digit number.");
        }

        // VALIDATE MILES
        if (!/^\d+$/.test(inv_miles)) {
            errors.push("Miles must be a number.");
        }

        // IF ERRORS, RETURN TO PAGE
        if (errors.length > 0) {
            return res.status(400).render("inventory/add-inventory", {
                title: "Vehicle Management",
                nav,
                errors: errors
            });
        }
    }
        // IF VALIDATION IS SUCCESSFUL, PROCEED WITH REGISTRATION
        const regResult = await managementModel.registerNewInventory(
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
            req.flash(
                "Notice",
                `Excellent! New Inventory successfully created.`
            )
            res.status(201).render('inventory/management', {
                title: 'Vehicle Management',
                nav,
                errors: null,
            })
        } else {
            req.flash('Notice', 'Sorry, the registration failed. =/')
            res.status(501).render("inventory/add-inventory", {
                title: "Vehicle Managment",
                nav,
                errors: null,
            })
        }

    }



    module.exports = invCont