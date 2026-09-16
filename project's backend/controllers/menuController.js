const MenuItem = require("../models/MenuItem");
const deleteUploadedFile = require("../utils/delete-uploaded-file");

const getAllMenuItems = async (req, res) => {   // returns all the menu items
  try {
    const menuItems = await MenuItem.find();
    res.status(200).json({
      status: "success",
      count: menuItems.length,
      data: {
        menuItems,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: `Error fetching menu items: ${error.message}`,
    });
  }
};

const createMenuItem = async (req, res) => {    // adding new menu item
  try {
    const category = req.body.category?.toLowerCase();
    const size = req.body.size?.toLowerCase();

    let ingredients = req.body.ingredients;
    if (typeof ingredients === "string") {
      ingredients = ingredients.split(",").map((i) => i.trim());
    }

    let sizes = req.body.sizes;
    if (typeof sizes === "string") {
      try { sizes = JSON.parse(sizes); } catch { sizes = []; }
    }

    let toppings = req.body.toppings;
    if (typeof toppings === "string") {
      try { toppings = JSON.parse(toppings); } catch { toppings = []; }
    }

    const newMenuItem = await MenuItem.create({
      ...req.body,
      category,
      size,
      ingredients,
      sizes,
      toppings,
      imageUrl: req.file?.filename,
    });

    res.status(201).json({
      status: "success",
      message: "Menu item added successfully",
      data: {
        menuItem: newMenuItem,
      },
    });
  } catch (error) {
    if (req.file) {
      deleteUploadedFile("menu", req.file.filename);
    }
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

const getMenuItemById = async (req, res) => {   // returns a menu item by its id
  try {
    const menuItem = await MenuItem.findById(req.params.id);
    if (!menuItem) {
      return res
        .status(404)
        .json({ status: "fail", message: "Menu item not found" });
    }

    res.status(200).json({
      status: "success",
      data: {
        menuItem,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

const updateMenuItem = async (req, res) => {    // edits the menu items
  try {
    const menuItem = await MenuItem.findById(req.params.id);

    if (!menuItem) {
      if (req.file) {
        deleteUploadedFile("menu", req.file.filename);
      }
      return res.status(404).json({
        status: "fail",
        message: "Menu item not found",
      });
    }

    if (req.body.category) req.body.category = req.body.category.toLowerCase();
    if (req.body.size) req.body.size = req.body.size.toLowerCase();

    if (typeof req.body.ingredients === "string") {
      req.body.ingredients = req.body.ingredients.split(",").map((i) => i.trim());
    }

    if (typeof req.body.sizes === "string") {
      try { req.body.sizes = JSON.parse(req.body.sizes); } catch { req.body.sizes = []; }
    }

    if (typeof req.body.toppings === "string") {
      try { req.body.toppings = JSON.parse(req.body.toppings); } catch { req.body.toppings = []; }
    }

    if (req.file) {
      req.body.imageUrl = req.file.filename;
      if (menuItem.imageUrl) {
        deleteUploadedFile("menu", menuItem.imageUrl);
      }
    }

    Object.assign(menuItem, req.body);
    const updatedMenuItem = await menuItem.save();

    res.status(200).json({
      status: "success",
      message: "Menu item updated successfully",
      data: { menuItem: updatedMenuItem },
    });
  } catch (error) {
    if (req.file) {
      deleteUploadedFile("menu", req.file.filename);
    }
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

const deleteMenuItem = async (req, res) => {    // deletes a menu item and removes its image  from the local storage
  try {
    const deletedMenuItem = await MenuItem.findByIdAndDelete(req.params.id);

    if (!deletedMenuItem) {
      return res.status(404).json({
        status: "fail",
        message: "Menu item not found",
      });
    }

    if (deletedMenuItem.imageUrl) {
      deleteUploadedFile("menu", deletedMenuItem.imageUrl);
    }

    res.status(200).json({
      status: "success",
      message: "Menu item deleted successfully",
      data: {
        menuItem: deletedMenuItem,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

module.exports = {
  getAllMenuItems,
  createMenuItem,
  getMenuItemById,
  updateMenuItem,
  deleteMenuItem,
};