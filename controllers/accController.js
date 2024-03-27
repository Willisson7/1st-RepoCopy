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

// PROCESSING REGISTRATION
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
    let nav = await utilities.getNav();
    const { account_email, account_password } = req.body;
    const accountData = await accountModel.getAccountByEmail(account_email);
    if (!accountData) {
        req.flash("Notice", "Please check your credentials and try again.");
        return res.status(400).render("/account/login", {
            title: "Login",
            nav,
            errors: null,
            account_email
        });
    }
    try {
        if (await bcrypt.compare(account_password, accountData.account_password)) {
            delete accountData.account_password;
            const { account_type, ...payload } = accountData; // Extracting account_type and other data from accountData
            const accessToken = jwt.sign({ ...payload, account_type }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 });
            res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 });
            return res.redirect("./account-management");
        }
    } catch (error) {
        return new Error('Access Forbidden');
    }
}

// BUILD ACCOUNT-MANAGEMENT VIEW
async function buildManagementView(req, res,) {
        let nav = await utilities.getNav()
        const {account_firstname} = res.locals.accountData
            req.flash("Notice", 'Sorry, there was an error processing the registration.')
            res.render('account/account-management', {
                title: `Welcome ${account_firstname}!` ,
                nav,
                errors: null,
            })
        }

// BUILD UPDATE USER INFO VIEW
async function buildUpdateUser(req, res,) {
    let nav = await utilities.getNav()
    const {account_firstname} = res.locals.accountData
        req.flash("Notice", 'Sorry, there was an error processing the registration.')
        res.render('account/update-user', {
            title: `Welcome ${account_firstname}!` ,
            nav,
            errors: null,
        })
    }
    
// PROCESSING UPDATE USER INFORMATION
async function updateAccount(req, res) {
    try {
        let nav = await utilities.getNav();
        // Extract account information from the request body
        const {
            account_id,
            account_firstname,
            account_lastname,
            account_email
        } = req.body;
        // Update account information
        const updateAccountResult = await accountModel.updateAccountData(
            account_id,
            account_firstname,
            account_lastname,
            account_email
        );
        // Check if a new password is being updated
        if (req.body.new_password) {
            const newPassword = req.body.new_password;
            const confirmPassword = req.body.confirm_password;
            // Check if the new password matches the confirm password
            if (newPassword !== confirmPassword) {
                req.flash("error", "New password and confirm password do not match.");
                return res.redirect("/update-account");
            }
            // Hash the new password
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            // Update password
            const updatePasswordResult = await accountModel.updatePassword(
                account_id,
                hashedPassword
            );
            if (!updatePasswordResult) {
                req.flash("error", "Failed to update password.");
                return res.redirect("/account/update-account");
            }
        }
        // Handle successful account update
        req.flash("success", "Account information updated successfully.");
        res.redirect("/account/account-management");
    } catch (error) {
        // Handle errors
        console.error("Error updating account:", error);
        req.flash("error", "Failed to update account information.");
        res.redirect("/account/update-account");
    }
}


module.exports = {buildLogin, buildRegister, registerAccount, accountLogin, buildManagementView, buildUpdateUser,updateAccount}