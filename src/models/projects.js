import db from "./db.js";

// UNUSED FUNCTION
/* const getAllProjects = async () => {
  const query = `
        SELECT o.organization_name, p.title, p.description, p.location, p.date
        FROM organizations o
        JOIN service_projects p
        ON o.organization_id = p.organization_id;
    `;

  const result = await db.query(query);

  return result.rows;
}; */

const getProjectsByOrganizationId = async (organizationId) => {
  const query = `
        SELECT
          project_id,
          organization_id,
          title,
          description,
          location,
          date
        FROM service_projects
        WHERE organization_id = $1
        ORDER BY date;
      `;

  const queryParams = [organizationId];
  const result = await db.query(query, queryParams);

  return result.rows;
};

const getUpcomingProjects = async (numberOfProjects) => {
  const query = `
    SELECT p.project_id, p.title, p.description, p.date, p.location, p.organization_id, o.organization_name
    FROM service_projects p
    JOIN organizations o
    ON p. organization_id = o.organization_id
    WHERE p.date >= CURRENT_DATE
    ORDER BY p.date ASC, p.project_id ASC
    LIMIT $1;
  `;

  const queryParams = [numberOfProjects];
  const result = await db.query(query, queryParams);

  return result.rows;
};

const getProjectDetails = async (projectId) => {
  const query = `
    SELECT p.project_id, p.title, p.description, p.date, p.location, p.organization_id, o.organization_name
    FROM service_projects p
    JOIN organizations o
    ON p. organization_id = o.organization_id
    WHERE p.project_id = $1;
  `;

  const queryParams = [projectId];
  const result = await db.query(query, queryParams);

  return result.rows[0];
};

const getCategoriesByProjectId = async (id) => {
  const query = `
        SELECT c.category_id, c.category_name
        FROM categories c
          JOIN project_categories pc
            ON c.category_id = pc.category_id
          JOIN service_projects p
            ON pc.project_id = p.project_id
        WHERE p.project_id = $1
        ORDER BY p.date ASC, p.project_id ASC;
    `;

  const result = await db.query(query, [id]);

  return result.rows;
};

export { /*getAllProjects, */getProjectsByOrganizationId, getUpcomingProjects, getProjectDetails, getCategoriesByProjectId };
