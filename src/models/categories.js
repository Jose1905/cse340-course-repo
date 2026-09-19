import db from "./db.js";

const getAllCategories = async () => {
  const query = `
        SELECT category_name
        FROM categories;
    `;

  const result = await db.query(query);

  return result.rows;
};

const getCategoryById = async (id) => {
  const query = `
        SELECT category_name
        FROM categories
        WHERE id = $1;
    `;

  const result = await db.query(query, [id]);

  return result.rows;
};

export { getAllCategories, getCategoryById };
