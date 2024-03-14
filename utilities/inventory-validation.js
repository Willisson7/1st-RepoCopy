const { body, validationResult } = require("express-validator");
const managementModel = require("../models/managementModel");

const validate = {};

// INVENTORY VALIDATION RULES

validate.inventoryRules = () => {
    return [
        // Example validation rules for each field
        body("classification_id").notEmpty().isNumeric().withMessage("Classification ID must be a number."),
        body("inv_make").notEmpty().withMessage("Make is required.").isLength({ min: 3 }).withMessage("Make must be at least 3 characters long."),
        body("inv_model").notEmpty().withMessage("Model is required.").isLength({ min: 3 }).withMessage("Model must be at least 3 characters long."),
        body("inv_description").notEmpty().withMessage("Description is required."),
        body("inv_image").notEmpty().withMessage("Image path is required."),
        body("inv_thumbnail").notEmpty().withMessage("Thumbnail path is required."),
        body("inv_price").notEmpty().withMessage("Price is required.").isDecimal().withMessage("Price must be a decimal."),
        body("inv_year").notEmpty().withMessage("Year is required.").isNumeric().isLength({ min: 4, max: 4 }).withMessage("Year must be a 4-digit number."),
        body("inv_miles").notEmpty().withMessage("Miles is required.").isNumeric().withMessage("Miles must be a number."),
        body("inv_color").notEmpty().withMessage("Color is required.")
    ];
};

// Validation middleware to handle validation errors
validate.validateInventory = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

module.exports = validate;
