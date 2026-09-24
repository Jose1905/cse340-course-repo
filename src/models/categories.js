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

const assignCategoryToProject = async (projectId, categoryId) => {
  const query = `
    INSERT INTO project_categories (project_id, category_id)
    VALUES ($1, $2)
    RETURNING *;
  `;

  const queryParams = [projectId, categoryId];
  const result = await db.query(query, queryParams);

  return result.rows[0];
};

const updateCategoryAssignments = async (projectId, categoryIds) => {
  const deleteQuery = `
    DELETE FROM project_categories
    WHERE project_id = $1;
  `

  const queryParams = [projectId];
  await db.query(deleteQuery, queryParams);

  const insertQuery = `
    INSERT INTO project_categories (project_id, category_id)
    VALUES ($1, $2);
  `;

  for (const categoryId of categoryIds) {
    await assignCategoryToProject(projectId, categoryId);
  }
};

export {
  getAllCategories,
  getCategoryById,
  getProjectsByCategoryId,
  assignCategoryToProject,
  updateCategoryAssignments
};
