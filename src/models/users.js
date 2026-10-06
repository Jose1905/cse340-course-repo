import db from "./db.js";
import bcrypt from "bcrypt";

const createUser = async (name, email, passwordHash) => {
  const default_role = "user";
  const query = `
        INSERT INTO users (name, email, password_hash, role_id) 
        VALUES ($1, $2, $3, (SELECT role_id FROM roles WHERE role_name = $4)) 
        RETURNING user_id
    `;
  const queryParams = [name, email, passwordHash, default_role];

  const result = await db.query(query, queryParams);

  if (result.rows.length === 0) {
    throw new Error("Failed to create user");
  }

  if (process.env.ENABLE_SQL_LOGGING === "true") {
    console.log("Created new user with ID:", result.rows[0].user_id);
  }

  return result.rows[0].user_id;
};

const findUserByEmail = async (email) => {
    const query = `
      SELECT u.name, u.user_id, u.email, u.password_hash, r.role_name 
      FROM users u
      JOIN roles r ON u.role_id = r.role_id
      WHERE u.email = $1
  `;
    const queryParams = [email];
    
    const result = await db.query(query, queryParams);

    if (result.rows.length === 0) {
        return null; // User not found
    }
    
    return result.rows[0];
};

const verifyPassword = async (password, passwordHash) => {
    return bcrypt.compare(password, passwordHash);
};

const authenticateUser = async (email, passwordHash) => {
  const user = await findUserByEmail(email);
  const authenticated = await verifyPassword(passwordHash, user.password_hash);

  if (!authenticated) {
    return null; // Password incorrect
  }

  const authenticatedUser = {
    user_id: user.user_id,
    name: user.name,
    email: user.email,
    role_id: user.role_id
  };

  return authenticatedUser;
};

const getAllUsers = async () => {
  const query = `
    SELECT u.user_id, u.name, u.email, r.role_name
    FROM users u
      JOIN roles r ON u.role_id = r.role_id
  `;

  const result = await db.query(query);

  return result.rows;
};

const getVolunteeredProjects = async (userId) => {
  const query = `
    SELECT p.project_id, p.title
    FROM users u
      JOIN volunteers v
      ON u.user_id = v.user_id
      JOIN service_projects p
      ON v.project_id = p.project_id
    WHERE v.user_id = $1
  `;

  const queryParams = [userId];
  const result = await db.query(query, queryParams);

  return result.rows;
};

const addVolunteer = async (projectId, userId) => {
  const query = `
    INSERT INTO volunteers (project_id, user_id)
    VALUES ($1, $2)
  `;

  const queryParams = [projectId, userId];
  const result = await db.query(query, queryParams);

  return result.rows;
};

const removeVolunteer = async (projectId, userId) => {
  const query = `
    DELETE FROM volunteers
    WHERE project_id = $1 AND user_id = $2
  `;

  const queryParams = [projectId, userId];
  await db.query(query, queryParams);
};

export {
  createUser,
  authenticateUser,
  findUserByEmail,
  getAllUsers,
  getVolunteeredProjects,
  addVolunteer,
  removeVolunteer
};
