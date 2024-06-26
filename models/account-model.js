const pool = require("../database/")


// Register new account

async function registerAccount(account_firstname, account_lastname, account_email, account_password) {
  try {
    const sql = "INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *"
    return await pool.query(sql, [account_firstname, account_lastname, account_email, account_password])
  } catch (error) {
    return error.message
  }
}

// Checking for existing email

async function checkExistingEmail(account_email) {
  try {
    const sql = "SELECT * FROM account WHERE account_email = $1"
    const email = await pool.query(sql, [account_email])
    return email.rowCount
  } catch (error) {
    return error.message
  }
}

// RETURN ACCOUNT DATA USING EMAIL ADDRESS

async function getAccountByEmail(account_email) {
  try {
    const result = await pool.query(
      `SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_email = $1`, [account_email])
    return result.rows[0]
  } catch (error) {
    return new Error("No matching email found")
  }
}


async function updateAccountData
  (
    account_firstname,
    account_lastname,
    account_email,
    account_id,)   {
  try {
    const sql = "UPDATE public.account SET account_firstname = $1, account_lastname = $2, account_email = $3 WHERE account_id = $4";
    return await pool.query(sql, [
      account_firstname,
      account_lastname,
      account_email,
      account_id
    ])
  } catch (error) {
    return error.message
  }
}

// CHANGE PASSWORD IN DATABASE
async function changePassword(account_id, hashedPassword) {
  try {
      const sql = "UPDATE public.account SET account_password = $1 WHERE account_id = $2";
      console.log("SQL Query:", sql); // Log the SQL query
      return await pool.query(sql, [hashedPassword, account_id]);
  } catch (error) {
      return error.message;
  }
}



module.exports = { registerAccount, checkExistingEmail, getAccountByEmail, updateAccountData, changePassword }