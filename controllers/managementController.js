// const utils = require('../utilities')
// const managementModel = require('../models/managementModel')
// // const baseController = {}



// async function createManagement(req, res, next) {
//     let nav = await utils.getNav()
//     // let hashedPassword
//     // try {
//     //     // regular password and cost (salt is generated automatically)
//     //     hashedPassword = await bcrypt.hash(account_password, 10)
//     // } catch (error) {
//     req.flash("Notice", 'Sorry, there was an error processing the registration.')
//     res.render('./inventory/management', {
//         title: "Vehicle Management",
//         nav,
//         errors: null,
//     })
// }


// // DELIVER ADD CLASS VIEW FUNCTION

// async function buildNewClassView(req, res, next) {
//     let nav = await utils.getNav()
//     req.flash("notice", "This is a flash message.")
//     res.render('./inventory/add-classification', {
//         title: "Vehicle Management",
//         nav,
//         errors: null,
//     })
// }


// // DELIVER ADD_INVENTORY VIEW

// async function buildAddInventoryView(req, res, next) {
//     let nav = await utils.getNav()
//     req.flash("notice", "This is a flash message.")
//     res.render('./inventory/add-inventory', {
//         title: "Vehicle Management",
//         nav,
//         errors: null,
//     })
// }

// // Processing Registration


// async function registerNewClass(req, res) {
//     let nav = await utils.getNav()
//     const {
//         classification_name
//     } = req.body
//     const regResult = await managementModel.registerNewClass(
//         classification_name
//     )
//     if (regResult) {
//         req.flash(
//             "Notice",
//             `Excellent! ${classification_name} successfully created.`
//         )
//         res.status(201).render('./inventory/management', {
//             title: 'Vehicle Management',
//             nav,
//             errors: null,
//         })
//     } else {
//         req.flash('Notice', 'Sorry, the registration failed. =/')
//         res.status(501).render("./inventory/management", {
//             title: "Vehicle Managment",
//             nav,
//             errors: null,
//         })
//     }

// }


// // TO DO: Modify this to registerNewInventory

// async function registerNewInventory(req, res) {
//     console.log('Look Here!')
//     let nav = await utils.getNav()
//     const {
//         classification_id,
//         inv_make, 
//         inv_model,
//         inv_description,
//         inv_image, 
//         inv_thumbnail,
//         inv_price, 
//         inv_year,
//         inv_miles,
//         inv_color
     
//     } = req.body


//     const regResult = await managementModel.registerNewInventory(

//         //  add the rest of the parameters
//         classification_id,
//         inv_make, 
//         inv_model,
//         inv_description,
//         inv_image, 
//         inv_thumbnail,
//         inv_price, 
//         inv_year,
//         inv_miles,
//         inv_color
//     )
//     if (regResult) {
//         req.flash(
//             "Notice",
//             `Excellent! New Inventory successfully created.`
//         )
//         res.status(201).render('inventory/management', {
//             title: 'Vehicle Management',
//             nav,
//             errors: null,
//         })
//     } else {
//         req.flash('Notice', 'Sorry, the registration failed. =/')
//         res.status(501).render("inventory/add-inventory", {
//             title: "Vehicle Managment",
//             nav,
//             errors: null,
//         })
//     }

// }
// module.exports = { buildNewClassView, registerNewClass, createManagement, buildAddInventoryView, registerNewInventory }