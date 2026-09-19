import db from "./db.js";

const getAllCategories = async () => {
  const query = `
        SELECT category_id, category_name
        FROM categories;
    `;

  const result = await db.query(query);

  return result.rows;
};

const getCategoryById = async (id) => {
  const query = `
        SELECT category_id, category_name
        FROM categories
        WHERE category_id = $1;
    `;

  const result = await db.query(query, [id]);

  return result.rows[0];
};

const getProjectsByCategoryId = async (categoryId) => {
  const query = `
    SELECT p.project_id, p.title, p.description, p.date, p.location, p.organization_id
    FROM categories c
          JOIN project_categories pc
            ON c.category_id = pc.category_id
          JOIN service_projects p
            ON pc.project_id = p.project_id
    WHERE c.category_id = $1
    ORDER BY p.date ASC, p.project_id ASC;
  `;

  const queryParams = [categoryId];
  const result = await db.query(query, queryParams);

  return result.rows;
};

export { getAllCategories, getCategoryById, getProjectsByCategoryId };
