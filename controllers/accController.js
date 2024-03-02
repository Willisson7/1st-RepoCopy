const utils = require('../utilities')
const accountModel = require('../models/accountModel')

// Deliver View function
async function buildLogin(req, res, next) {
    let nav = await utils.getNav()
    // req.flash("notice", "This is a flash message.")
    res.render('account/login', {
        title: "Login",
        nav,
    })
}

async function buildRegister(req, res, next) {
    let nav = await utils.getNav()

    res.render('account/registration', {
        title: "Register Your Account",
        nav,
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

    const regResult = await accountModel.registerAccount(
        account_firstname,
        account_lastname,
        account_email,
        account_password,
    )

    if (regResult){
        req.flash(
            "Notice",
            `Excellent! ${account_firstname}  ${account_lastname} is now registered. Please log in.`
        )
        res.status(201).render('account/login', {
        title: 'Login',
        nav,
    })
 }else {
    req.flash('Notice', 'Sorry, the registration failed. =/')
        res.status(501).render("account/registration", {
            title: "Register Your Account",
            nav,
            errors:null,
        })
    }
 }



 
    module.exports = { buildLogin, buildRegister, registerAccount }