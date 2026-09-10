import db from "./db.js";

const getAllProjects = async () => {
  const query = `
        SELECT o.name, p.title, p.description, p.location, p.date
        FROM organizations o
        JOIN service_projects p
        ON o.id = p.organization_id;
    `;

  const result = await db.query(query);

  return result.rows;
};

export { getAllProjects };
