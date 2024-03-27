const pool = require("../database/")


/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications() {
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

// FUNCTION TO RETURN ALL INVENTORY ITEMS 
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i
      JOIN public.classification AS c
      ON i.classification_id = c.classification_id
      WHERE i.classification_id =$1`,
      [classification_id]
    )
    return data.rows
  } catch (error) {
    console.error('getclassificationbyid error ' + error)
  }
}

// FUNCTION TO GRAB  INVENTORY ID AND STORE THEM IN DATA VARIABLE
async function getInventoryById(inv_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i
      WHERE i.inv_id = $1`,
      [inv_id]
    );
    return data.rows[0];
  } catch (error) {
    console.error('getInventoryById error' + error);
    throw error; // Rethrow the error for handling in the calling code
  }
}

// FUNCTION TO ADD A NEW CLASSIFICATION OF VEHICLE
async function registerNewClass(classification_name) {
  try {
    const queryText = `INSERT INTO public.classification(classification_name)
    VALUES ($1)`
    const data = await pool.query(queryText, [classification_name]
    );
   
    return data;
  } catch (error) {
    console.error('getInventoryById error' + error);
    throw error; // Rethrow the error for handling in the calling code
  }
}

// FUNCTION TO ADD NEW VEHICLES TO THE DATABASE
async function registerNewInventory(
  classification_id,
  inv_make, inv_model,
  inv_description,
  inv_image,
  inv_thumbnail,
  inv_price,
  inv_year,
  inv_miles,
  inv_color) {

  try {
    const queryText = `INSERT INTO public.inventory ( 
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
      classification_id)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    RETURNING *`
    const data = await pool.query(queryText, [
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
      classification_id,
    ]
    );
   
    return data;
  } catch (error) {
    console.error('getInventoryById error' + error);
    throw error; // Rethrow the error for handling in the calling code
  }
}

// UPDATE INVENTORY DATA
async function updateInventory(
  inv_id,
  inv_make,
  inv_model,
  inv_description,
  inv_image,
  inv_thumbnail,
  inv_price,
  inv_year,
  inv_miles,
  inv_color,
  classification_id
) {
  try {
    const sql =
      "UPDATE public.inventory SET inv_make = $1, inv_model = $2, inv_description = $3, inv_image = $4, inv_thumbnail = $5, inv_price = $6, inv_year = $7, inv_miles = $8, inv_color = $9, classification_id = $10 WHERE inv_id = $11 RETURNING *"
    const data = await pool.query(sql, [
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
      classification_id,
      inv_id
    ])
    return data.rows[0]
  } catch (error) {
    console.error("model error: " + error)
  }
}

// DELETE INVENTORY ITEM
async function deleteInventoryItem(
  inv_id,
  inv_make,
  inv_model,
  inv_description,
  inv_image,
  inv_thumbnail,
  inv_price,
  inv_year,
  inv_miles,
  inv_color,
  classification_id
) {
  try {
    const sql =
      "DELETE FROM public.inventory WHERE inv_id = $1"
    const data = await pool.query(sql, [inv_id])
    return data
  } catch (error) {
    new Error("Delete Inventory Error")
  }
}
module.exports = { getClassifications, getInventoryByClassificationId, getInventoryById, updateInventory, registerNewInventory, registerNewClass, deleteInventoryItem };