import { body, validationResult } from "express-validator";
import {
  getAllCategories,
  getCategoryById,
  getProjectsByCategoryId,
  updateCategoryAssignments,
  createCategory,
  editCategory
} from "../models/categories.js";
import {
  getProjectDetails,
  getCategoriesByProjectId,
} from "../models/projects.js";

const categoryValidation = [
  body('category_name')
    .trim()
    .notEmpty()
    .withMessage('Category name is required')
    .isLength({ min: 3, max: 150 })
    .withMessage('Category name must be between 3 and 150 characters')
];

const showCategoriesPage = async (req, res) => {
  const categories = await getAllCategories();
  const title = "Service Categories";

  res.render("categories", { title, categories });
};

const showCategoryDetailsPage = async (req, res) => {
  const categoryId = req.params.id;
  const categoryDetails = await getCategoryById(categoryId);
  const projects = await getProjectsByCategoryId(categoryId);
  const title = `Category Details - ${categoryDetails.category_name}`;
  console.log("Category Details:", categoryDetails);

  res.render("category", { title, projects, categoryDetails });
};

const showAssignCategoriesForm = async (req, res) => {
  const projectId = req.params.id;
  const projectDetails = await getProjectDetails(projectId);
  const categories = await getAllCategories();
  const assignedCategories = await getCategoriesByProjectId(projectId);
  const title = "Assign Categories to Project";

  res.render("assign-categories", {
    title,
    projectId,
    projectDetails,
    categories,
    assignedCategories,
  });
};

const processAssignCategoriesForm = async (req, res) => {
  const projectId = req.params.id;
  const selectedCategoryIds = req.body.categoryIds || [];

  try {
    const categoryIdsArray = Array.isArray(selectedCategoryIds) ? selectedCategoryIds : [selectedCategoryIds];
    await updateCategoryAssignments(projectId, categoryIdsArray);
    req.flash("success", "Categories updated successfully!");
    res.redirect(`/project/${projectId}`);
  } catch (error) {
    console.error("Error updating project categories:", error);
    req.flash(
      "error",
      "Failed to update project categories. Please try again.",
    );
    res.redirect(`/assign-categories/${projectId}`);
  }
};

const showNewCategoryForm = async (req, res) => {
  const title = "New Category";
  res.render("new-category", { title });
};

const processNewCategoryForm = async (req, res) => {
  const results = validationResult(req);
    if (!results.isEmpty()) {
      // Validation failed - loop through errors
      results.array().forEach((error) => {
        req.flash('error', error.msg);
      });

      // Redirect back to the new category form
      return res.redirect('/new-category');
    }

    const { category_name } = req.body;
    
    const categoryId = await createCategory(category_name);

    req.flash('success', 'Category added successfully!');

    res.redirect(`/category/${categoryId}`);
};

const showEditCategoryForm = async (req, res) => {
  const categoryId = req.params.id;
  const categoryDetails = await getCategoryById(categoryId);
  const title = "Edit category";

  res.render("edit-category", { title, categoryDetails });
};

const processEditCategoryForm = async (req, res) => {
  const categoryId = req.params.id;

  const results = validationResult(req);
    if (!results.isEmpty()) {
      // Validation failed - loop through errors
      results.array().forEach((error) => {
        req.flash('error', error.msg);
      });

      // Redirect back to the new category form
      return res.redirect(`/edit-category/${categoryId}`);
    }

    const { category_name } = req.body;

    await editCategory(categoryId, category_name);

    req.flash('success', 'Category updated successfully!');

    res.redirect(`/category/${categoryId}`)
};

export {
  showCategoriesPage,
  showCategoryDetailsPage,
  showAssignCategoriesForm,
  processAssignCategoriesForm,
  showNewCategoryForm,
  categoryValidation,
  processNewCategoryForm,
  showEditCategoryForm,
  processEditCategoryForm
};
