
const utils = require(".")
const { body, validationResult } = require("express-validator")
const accountModel = require("../models/account-model")
const validate = {}

/*  **********************************
 *  Registration Data Validation Rules
 * ********************************* */
validate.registationRules = () => {
  return [
    // firstname is required and must be string
    body("account_firstname")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please provide a first name."), // on error this message is sent.

    // lastname is required and must be string
    body("account_lastname")
      .trim()
      .isLength({ min: 2 })
      .withMessage("Please provide a last name."), // on error this message is sent.

    // valid email is required and cannot already exist in the DB

    body("account_email")
      .trim()
      .isEmail()
      .normalizeEmail() // refer to validator.js docs
      .withMessage("A valid email is required.")
      .custom(async (account_email) => {
        const emailExists = await accountModel.checkExistingEmail(account_email)
        if (emailExists) {
          throw new Error("Email exists. Please log in or use different email")
        }
      }),

    // password is required and must be strong password

    body("account_password")
      .trim()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage("Password does not meet requirements."),
  ]
}

/* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */

validate.checkRegData = async (req, res, next) => {

  const { account_firstname, account_lastname, account_email } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utils.getNav()
    res.render("account/register", {
      errors,
      title: "Registration",
      nav,
      account_firstname,
      account_lastname,
      account_email,
    })
    return
  }
  next()
}

/* **********************
 *   Check for existing email
 * ********************* */
validate.checkExistingEmail = async function (account_email) {
  try {
    const sql = "SELECT * FROM account WHERE account_email = $1"
    const email = await pool.query(sql, [account_email])
    return email.rowCount
  } catch (error) {
    return error.message
  }

}

// LOGIN VALIDATION RULES

validate.loginRules = () => {
  return [
    // Require valid email address
    body("account_email")
      .trim()
      .isEmail()
      .normalizeEmail() // refer to validator.js docs
      .withMessage("A valid email is required."),

    // Require matching password.
    body("account_password")
      .trim()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage("Password does not meet requirements.")
  ]
}

// CHECK LOGIN DATA

validate.checkLoginData = async (req, res, next) => {
  const { account_email, account_password } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utils.getNav()
    res.render("account/login", {
      errors,
      title: "Registration",
      nav,
      account_email,
    })
    return
  }
  next()
}

// DECLARING ACCOUNT UPDATE RULES
validate.updateRules = () => {
  return [
    // if input detected, rules applied to input
    body("account_firstname")
      .optional()
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please provide a first name.")
      .isAlpha()
      .withMessage("First name must contain only alphabetical characters."),

    // if input detected, rules applied to input
    body("account_lastname")
      .optional()
      .trim()
      .isLength({ min: 2 })
      .withMessage("Please provide a last name.")
      .isAlpha()
      .withMessage("Last name must contain only alphabetical characters."),

    //if input detected, rules applied to email
    body("account_email")
      .optional()
      .trim()
      .isEmail()
      .normalizeEmail()
      .withMessage("A valid email is required."),

    // password is required and must be strong password
  ]
}

// CHECK UPDATE INFO
validate.checkUpdateData = async (req, res, next) => {
  const { account_firstname, account_lastname, account_email, account_id } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utils.getNav()
    res.render("account/update-user", {
      errors,
      title: "Update Your Account Information",
      nav,
      account_firstname,
      account_lastname,
      account_email,
      account_id
    })
    return
  }
  next()
}


validate.updatePassRules = () => {
  return [
   // Require matching password.
   body("account_password")
   .trim()
   .isStrongPassword({
     minLength: 12,
     minLowercase: 1,
     minUppercase: 1,
     minNumbers: 1,
     minSymbols: 1,
   })
   .withMessage("Password does not meet requirements.")
  ]
}

validate.checkUpdatePass = async (req, res, next) => {
  const {account_password} = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utils.getNav()
    res.render("account/update-user", {
      errors,
      title: "Update Your Account Information ",
      nav,
      account_password,
    })
    return
  }
  next()
}
module.exports = validate

