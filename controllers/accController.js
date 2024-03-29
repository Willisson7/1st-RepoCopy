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
    const { account_firstname } = res.locals.accountData
    req.flash("Notice", 'Sorry, there was an error processing the registration.')
    res.render('account/account-management', {
        title: `Welcome ${account_firstname}!`,
        nav,
        errors: null,
        account_id: res.locals.accountData.account_id,
    })
}

// BUILD UPDATE USER INFO VIEW
async function buildUpdateUser(req, res,) {
    let nav = await utilities.getNav()
    const {account_firstname, account_lastname, account_email} = res.locals.accountData
    req.flash("Notice", 'Sorry, there was an error in the update process.')
    res.render(`account/update-user`, {
        title: `Welcome ${account_firstname}!`,
        nav,
        errors: null,
        account_id: res.locals.accountData.account_id,
        account_firstname,
        account_lastname,
        account_email
    })
}

// PROCESSING UPDATE USER INFORMATION
async function updateAccount(req, res) {
    let nav = await utilities.getNav();
    // Extract account information from the request body
    const {
        account_firstname,
        account_lastname,
        account_email,
        account_id
    } = req.body;
    console.log("eyes here", req.body)
    // Update account information
    const updateResult = await accountModel.updateAccountData(
        account_firstname,
        account_lastname,
        account_email,
        account_id, 
    );
    if (updateResult) {
        console.log("Grant", updateResult)
        let nav = await utilities.getNav()
        const {account_firstname, account_lastname, account_email} = res.locals.accountData
        req.flash("success", "Account information updated successfully.");
        res.render("account/account-management", {
            title: "Manage Account",
            nav,
            errors:null,
            account_firstname,
            account_lastname,
            account_email,
            account_id: res.locals.accountData.account_id,
        });
    }
    else {
        console.error("Error updating account:", updateResult);
        req.flash("error", "Failed to update account information. Please try again later.");
        res.render("account/update-user", {
            title: "Update Account",
            nav,
            account_id,
            account_firstname,
            account_lastname,
            account_email
        });
    }
}

async function updatePassword(req, res) {
    let nav = await utilities.getNav()
    const {account_id, account_password} = req.body
    console.log("Oi!!!", account_password)
    let hashedPassword

    try {
        // Hash the password using bcrypt
        hashedPassword = await bcrypt.hash(account_password, 10);
        console.log("hashedPassword", hashedPassword)
    } catch (error) {
        req.flash("notice", 'Gosh darn it, I done goofed again. Password Change Not Completed');
        res.status(500).render("account/update-password", {
            title: "Update Your Account Information",
            nav,
            errors: null,
            account_id,
            hashedPassword
        });
        return; // Return to avoid executing the rest of the function in case of an error
    }
    const regResult = await accountModel.changePassword(
        account_id,
        hashedPassword
    )
    console.log("Change Password Result:", regResult);

    if (regResult) {
        req.flash(
            "notice",
            `Excellent! Password has been updated.`
        )
        res.status(201).redirect('/account/account-management')
          
    
    } else {
        req.flash('Notice', 'Sorry, password change could not be completed =/')
        res.status(501).render("account/update-user", {
            title: "Update Your Account Information",
            nav,
            errors: null,
        })
    }
}

   

module.exports = { buildLogin, buildRegister, registerAccount, accountLogin, buildManagementView, buildUpdateUser, updateAccount, updatePassword}