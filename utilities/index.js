const invModel = require("../models/inventory-model")
const Util = {}


/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  // console.log(data.rows)
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




module.exports = Util;