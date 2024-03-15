const pool = require("../database/")





// get inventory items by inventory id



async function registerNewClass(classification_name) {
    try {
      const queryText = `INSERT INTO public.classification(classification_name)
      VALUES ($1)`
      const data = await pool.query(queryText, [classification_name]
      );
      console.log('Eyes Here', data)
      return data;
    } catch (error) {
      console.error('getInventoryById error' + error);
      throw error; // Rethrow the error for handling in the calling code
    }
  }


  // TO DO : Modify to bring in all relevant data from database. inv_make, model etc.. 

  async function registerNewInventory(classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color) {
    console.log('Eyes Here', classification_id)
    try {
      const queryText = `INSERT INTO public.inventory (classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`
      const data = await pool.query(queryText, [classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color]
      );
      console.log('Eyes Here', data)
      return data;
    } catch (error) {
      console.error('getInventoryById error' + error);
      throw error; // Rethrow the error for handling in the calling code
    }
  }




  
  module.exports = {registerNewClass, registerNewInventory}