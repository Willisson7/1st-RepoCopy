const utils = require('../utilities')
const accountModel = require('../models/account-model')
const bcrypt = require('bcryptjs')
// const baseController = {}

// Deliver View function
async function buildLogin(req, res, next) {
    let nav = await utils.getNav()
    req.flash("notice", "This is a flash message.")
    res.render('account/login', {
        title: "Login",
        nav,
        errors: null,
    })
}

async function buildRegister(req, res, next) {
    let nav = await utils.getNav()
    // let hashedPassword
    // try {
    //     // regular password and cost (salt is generated automatically)
    //     hashedPassword = await bcrypt.hash(account_password, 10)
    // } catch (error) {
        req.flash("Notice", 'Sorry, there was an error processing the registration.')
        res.render('account/register', {
            title: "Register Your Account",
            nav,
            errors: null,
        })
    }



// Processing Registration


async function registerAccount(req, res) {
    let nav = await utils.getNav()
    const {
        account_firstname,
        account_lastname,
        account_email,
        account_password,
    } = req.body

    let hashedPassword;
  try {
    // Hash the password using bcrypt
    hashedPassword = await bcrypt.hash(account_password, 10);
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.');
    res.status(500).render("account/registration", {
      title: "Registration",
      nav,
      errors: null,
    });
    return; // Return to avoid executing the rest of the function in case of an error
  }

    const regResult = await accountModel.registerAccount(
        account_firstname,
        account_lastname,
        account_email,
        hashedPassword,
    )

    if (regResult) {
        req.flash(
            "Notice",
            `Excellent! ${account_firstname}  ${account_lastname} is now registered. Please log in.`
        )
        res.status(201).render('account/login', {
            title: 'Login',
            nav,
            errors: null,
        })
    } else {
        req.flash('Notice', 'Sorry, the registration failed. =/')
        res.status(501).render("account/register", {
            title: "Register Your Account",
            nav,
            errors: null,
        })
    }
}




module.exports = { buildLogin, buildRegister, registerAccount }