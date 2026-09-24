import {
  getAllCategories,
  getCategoryById,
  getProjectsByCategoryId,
  assignCategoryToProject,
  updateCategoryAssignments,
} from "../models/categories.js";
import {
  getProjectDetails,
  getCategoriesByProjectId,
} from "../models/projects.js";

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

  res.render("category", { title, projects });
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

export {
  showCategoriesPage,
  showCategoryDetailsPage,
  showAssignCategoriesForm,
  processAssignCategoriesForm,
};
