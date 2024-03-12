const pool = require("../database/")





// get inventory items by inventory id



async function registerNewClass(classification_name) {
    try {
      const queryText = `INSERT INTO public.classification(classification_name)
      VALUES ($1) `
      const data = await pool.query(queryText, [classification_name]
      );
      console.log('Eyes Here', data.rows[0])
      return data.rows[0];
    } catch (error) {
      console.error('getInventoryById error' + error);
      throw error; // Rethrow the error for handling in the calling code
    }
  }

  module.exports = {registerNewClass}