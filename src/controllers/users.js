import bcrypt from "bcrypt";
import {
  createUser,
  authenticateUser,
  findUserByEmail,
  getAllUsers,
  getVolunteeredProjects,
} from "../models/users.js";
import { body, validationResult } from "express-validator";

const userValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("User name is required")
    .isLength({ min: 1, max: 100 })
    .withMessage("User name must be between 1 and 100 characters"),
  body("email")
    .normalizeEmail()
    .notEmpty()
    .withMessage("Contact email is required")
    .isEmail()
    .withMessage("Please provide a valid email address"),
  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 3 })
    .withMessage("Password must be at least 3-character long"),
];

const showUserRegistrationForm = (req, res) => {
  res.render("register", { title: "Register" });
};

const processUserRegistrationForm = async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log("User validation errors:", errors.array());

    // Loop through validation errors and flash them
    errors.array().forEach((error) => {
      req.flash("error", error.msg);
    });

    // Redirect back to the new user form
    return res.redirect("/register");
  }

  const { name, email, password } = req.body;

  try {
    // Hash the password before storing it
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create the user in the database
    await createUser(name, email, passwordHash);

    // Redirect to the home page after successful registration
    req.flash("success", "Registration successful! Please log in.");
    res.redirect("/login");
  } catch (error) {
    console.error("Error registering user:", error);
    req.flash(
      "error",
      "An error occurred during registration. Please try again.",
    );
    res.redirect("/register");
  }
};

const showLoginForm = (req, res) => {
  res.render("login", { title: "Login" });
};

const processLoginForm = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await authenticateUser(email, password);
    if (user) {
      const userData = await findUserByEmail(email);
      // Store user info in session
      req.session.user = userData;
      req.flash("success", "Login successful!");

      if (res.locals.NODE_ENV === "development") {
        console.log("User logged in:", userData);
      }

      res.redirect("/dashboard");
    } else {
      req.flash("error", "Invalid email or password.");
      res.redirect("/login");
    }
  } catch (error) {
    console.error("Error during login:", error);
    req.flash("error", "An error occurred during login. Please try again.");
    res.redirect("/login");
  }
};

const processLogout = async (req, res) => {
  if (req.session.user) {
    delete req.session.user;
  }

  req.flash("success", "Logout successful!");
  res.redirect("/login");
};

const requireLogin = async (req, res, next) => {
  if (!req.session || !req.session.user) {
    req.flash("error", "Please Log in before you continue");
    return res.redirect("/login");
  }

  next();
};

/**
 * Middleware factory to require specific role for route access
 * Returns middleware that checks if user has the required role
 *
 * @param {string} role - The role name required (e.g., 'admin', 'user')
 * @returns {Function} Express middleware function
 */
const requireRole = (role) => {
  return (req, res, next) => {
    // Check if user is logged in first
    if (!req.session || !req.session.user) {
      req.flash("error", "You must be logged in to access this page.");
      return res.redirect("/login");
    }

    // Check if user's role matches the required role
    if (req.session.user.role_name !== role) {
      req.flash("error", "You do not have permission to access this page.");
      return res.redirect("/");
    }

    // User has required role, continue
    next();
  };
};

const showDashboard = async (req, res) => {
  const user = req.session.user;
  const userId = user.user_id;
  const projects = await getVolunteeredProjects(userId);

  res.render("dashboard", {
    title: "Dashboard",
    name: user.name,
    email: user.email,
    projects
  });
};

const showUsersPage = async (req, res) => {
  const users = await getAllUsers();
  const title = "Registered Users";

  res.render("users", { title, users});
};

export {
  showUserRegistrationForm,
  processUserRegistrationForm,
  userValidation,
  showLoginForm,
  processLoginForm,
  processLogout,
  requireLogin,
  showDashboard,
  requireRole,
  showUsersPage
};
