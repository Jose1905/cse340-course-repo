// Define the showHomePage controller function
const showHomePage = async (req, res) => {
    const title = "Home";
    res.render("home", { title });
};

// Export the showHomePage function for use in other modules
export { showHomePage };