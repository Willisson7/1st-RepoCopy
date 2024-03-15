const utilities = require('../utilities')
const accountModel = require('../models/account-model')
const bcrypt = require('bcryptjs')
const jwt = require("jsonwebtoken") 
require("dotenv").config()
// const baseController = {}

// Deliver Login View 
async function buildLogin(req, res, next) {
    let nav = await utilities.getNav()
    req.flash("notice", "This is a flash message.")
    res.render('account/login', {
        title: "Login",
        nav,
        errors: null,
    })
}

// DELIVER REGISTRATION VIEW
async function buildRegister(req, res, next) {
    let nav = await utilities.getNav()
 
        req.flash("Notice", 'Sorry, there was an error processing the registration.')
        res.render('account/register', {
            title: "Register Your Account",
            nav,
            errors: null,
        })
    }

// Processing Registration

async function registerAccount(req, res) {
    let nav = await utilities.getNav()
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
    res.status(500).render("account/register", {
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


async function accountLogin(req, res) {
    let nav = await utilities.getNav()
    const {account_email, account_password} = req.body
    const accountData = await accountModel.getAccountByEmail(account_email)
    if (!accountData){
        req.flash("Notice", "Please check your credentials and try again.")
        res.status(400).render("/account/login", {
            title: "Login",
            nav,
            errors: null,
            account_email
        })
        return
    }
    try{
        if (await bcrypt.compare(account_password, accountData.account_password)){
            delete accountData.account_password
            const accessToken = jwt.sign(accountData, process.env.
                ACCESS_TOKEN_SECRET, {expiresIn: 3600 * 1000 })
                res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000})
                return res.redirect("/account")
                }
        } catch (error){
            return new Error('Access Forbidden')
        }
    }
// BUILD ACCOUNT-MANAGMENT VIEW

    async function buildManagementView(req, res, next) {
        let nav = await utilities.getNav()
     
            req.flash("Notice", 'Sorry, there was an error processing the registration.')
            res.render('account/account-management', {
                title: "Welcome ${account_firstname}" ,
                nav,
                errors: null,
            })
        }

        
module.exports = { buildLogin, buildRegister, registerAccount, accountLogin, buildManagementView }