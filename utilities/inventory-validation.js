const { body, validationResult } = require("express-validator");
const utils = require('../utilities')

const validate = {};

// RULES FOR ADDING NEW CLASSIFICATION
validate.addClassificationRules = () => {
  return [
    body("classification_name")
      .trim()
      .isLength({ min: 1 })
      .isAlpha()
      .withMessage("Please provide a classification name"),
  ]
}
// CHECKING CLASSIFICATION DATA AND RETURNING ANY ERRORS 
validate.checkClassificationData = async (req, res, next) => {
  const { classification_name } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utils.getNav()
    res.render("inventory/add-classification", {
      errors,
      title: "Add New Classification",
      nav,
      classification_name
    })
    return
  }
  next()
}

// RULES FOR ADDING INVENTORY 
validate.inventoryRules = () => {
  return [
    body("classification_id")
      .trim()
      .isInt({ no_symbols: true })
      .withMessage("Vehicle classification is required."),

    body("inv_make")
      .trim()
      .escape()
      .isLength({ min: 3, })
      .withMessage("Vehicle make is required."),

    body("inv_model")
      .trim()
      .escape()
      .isLength({ min: 3, })
      .withMessage("Vehicle Model is required."),

    body("inv_description")
      .trim()
      .escape()
      .isLength({ min: 3, })
      .withMessage("Vehicle description is required."),

    body("inv_image")
      .trim()
      .isLength({ min: 6, })
      .matches(/\.(jpg|jpeg|png|webp)$/)
      .withMessage("Vechile image path required. Must be an image."),

    body("inv_thumbnail")
      .trim()
      .isLength({ min: 6, })
      .matches(/\.(jpg|jpeg|png|webp)$/)
      .withMessage("Vehicle thumbnail path required. Must be an image"),

    body("inv_price")
      .trim()
      .isDecimal()
      .withMessage("Vehicle price required"),

    body("inv_year")
      .trim()
      .isInt({
        min: 1900,
        max: 2099,
      })
      .withMessage("Vehicle year required"),

    body("inv_miles")
      .trim()
      .isInt({
        no_symbols: true,
      })
      .withMessage("Vehicle mileage required"),

    body("inv_color")
      .trim()
      .escape()
      .isLength({ min: 3, })
      .withMessage("Vehicle color required."),
  ]
}

// VALIDATING USER INPUT FOR UPDATING INVENTORY. 
validate.checkInvData = async (req, res, next) => {
  const {
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
  } = req.body
  let errors = []
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utils.getNav()
    const classificationList = await utils.buildClassificationList(
      classification_id
    )
    res.render("inventory/add-inventory", {
      errors,
      title: "Add Vehicle",
      nav,
      classificationList,
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
    })
    return
  }
  next();
};

// THE RULES FOR UPDATING INVENTORY ITEMS
validate.updateInvRules = () => {
  return [
    // Make is required and must be at least 3 characters long  
    body("inv_make")
      .trim()
      .isLength({ min: 3 })
      .withMessage("Make must be at least 3 characters long."),

    // Model is required and must be at least 3 characters long
    body("inv_model")
      .trim()
      .isLength({ min: 3 })
      .withMessage("Model must be at least 3 characters long."),

    // Year is required and must be a 4-digit number
    body("inv_year")
      .trim()
      .isNumeric()
      .isLength({ min: 4, max: 4 })
      .withMessage("Year must be a 4-digit number."),

    // Description is required
    body("inv_description")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Description is required."),

    // Image Path is required and must be a valid URL
    body("inv_image")
      .trim()
      .isURL()
      .withMessage("Image Path must be a valid URL."),

    // Thumbnail Path is required and must be a valid URL
    body("inv_thumbnail")
      .trim()
      .isURL()
      .withMessage("Thumbnail Path must be a valid URL."),

    // Price is required and must be a valid number
    body("inv_price")
      .trim()
      .isNumeric()
      .withMessage("Price must be a valid number."),

    // Miles is required and must be a valid number
    body("inv_miles")
      .trim()
      .isNumeric()
      .withMessage("Miles must be a valid number."),

    // Color is required
    body("inv_color")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Color is required."),

    // Classification ID is required and must be a valid number
    body("classification_id")
      .trim()
      .isNumeric()
      .withMessage("Classification ID must be a valid number.")
  ];
};

// MIDDLEWARE TO CHECK UPDATE INFORMATION FOR VALIDATION
validate.checkUpdateData = async (req, res, next) => {
  const {
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
  } = req.body;
  let errors = validationResult(req);
  // IF ERRORS ARE PRESENT REDIRECT TO EDIT VIEW
  if (!errors.isEmpty()) {
    let nav = await utils.getNav();
    res.render("inventory/edit", {
      errors,
      title: "Edit Inventory",
      nav,
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
    });
    return;
  }
  next();
};


module.exports = validate;
