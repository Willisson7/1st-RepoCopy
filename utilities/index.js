const invModel = require("../models/inventory-model")
const jwt = require("jsonwebtoken")
require("dotenv").config()
const Util = {}


/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}

// Building the classification view HTML
Util.buildClassificationGrid = async function (data) {
  let grid
  if (data.length > 0) {
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => {
      grid += '<li>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id
        + '" title="View ' + vehicle.inv_make + ' ' + vehicle.inv_model
        + 'details"><img src="' + vehicle.inv_thumbnail
        + '" alt="Image of ' + vehicle.inv_make + ' ' + vehicle.inv_model
        + ' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id + '" title="View '
        + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">'
        + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span id="price">$'
        + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else {
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

Util.buildDetailView = async function (vehicle) {
  let grid = '';
  if (vehicle) {
    grid += `
    <div class="vehicle-detail">
    <h1>${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}</h1>
    <div class="row">
      <div class="heading-column">
      </div>
    </div>
    <div class="row">
      <div class="column">
        <div class="imgColumn">
          <img src="${vehicle.inv_image}" alt="Car-Image">
        </div>
      </div>
      <div class="column">
        <div class="pColumn">
          <h2>${vehicle.inv_make} ${vehicle.inv_model} Details</h1>
          <p><span class="bold">Price: $${vehicle.inv_price}</span></p>
          <p><span class="bold">Description</span>: ${vehicle.inv_description}</p>
          <p><span class="bold">Color</span>: ${vehicle.inv_color}</p>
          <p><span class="bold">Miles</span>: ${vehicle.inv_miles}</p>
        </div>
      </div>
    </div>
  </div>
  
    `;
  } else {
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>';
  }
  return grid;
};

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */


Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)


// MIDDLEWARE FOR CHECKING TOKEN VALIDITY

Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
      jwt.verify(
          req.cookies.jwt,
          process.env.ACCESS_TOKEN_SECRET,
          function (err, decodedToken) {
              if (err) {
                  req.flash("notice", "Please log in");
                  res.clearCookie("jwt");
                  return res.redirect("/account/login");
              }
              // Check if account type is neither 'admin' nor 'employee'
              if (decodedToken.account_type !== 'Admin' && decodedToken.account_type !== 'Employee') {
                  // Check if the requested route is an /inv route
                  if (req.originalUrl === '/inv/') {
                      req.flash("notice", "Your account does not have access to this page.");
                      return res.redirect("/account/login");
                  }
              }
              // Grant access to decodedToken data
              res.locals.accountData = decodedToken;
              res.locals.loggedin = 1;
              res.locals.account_firstname = decodedToken.account_firstname;
              res.locals.account_type = decodedToken.account_type;
              return next();
          }
      );
  } else {
      next();
  }
};

/* ****************************************
 *  Check Login
 * ************************************ */

Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next()
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
 }

// BUILD CLASSIFICATION LIST

 Util.buildClassificationList = async function (classification_id = null) {
  let data = await invModel.getClassifications()
  let classificationList =
    '<select name="classification_id" id="classificationList" required>'
  classificationList += "<option value=''>Choose a Classification</option>"
  data.rows.forEach((row) => {
    classificationList += '<option value="' + row.classification_id + '"'
    if (
      classification_id != null &&
      row.classification_id == classification_id
    ) {
      classificationList += " selected "
    }
    classificationList += ">" + row.classification_name + "</option>"
  })
  classificationList += "</select>"
  return classificationList
}

// CHECK ACCOUNT TYPE
function requireEmployeeOrAdmin(req, res, next) {
  // Get the JWT token from the request headers
  const token = req.headers.authorization;

  // Check if token is present
  if (!token) {
      return res.status(401).send({ message: 'Unauthorized: Missing token' });
  }

  // Verify the token
  jwt.verify(token, 'secret', (err, decoded) => {
      if (err) {
          return res.status(401).send({ message: 'Unauthorized: Invalid token' });
      }

      // Check if the decoded token contains account type
      const accountType = decoded.accountType;
      if (accountType !== 'Employee' && accountType !== 'Admin') {
          return res.status(403).send({ message: 'Forbidden: Access denied' });
      }

      // If account type is Employee or Admin, grant access
      next();
  });
}

module.exports = Util;