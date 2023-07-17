const Category = require("../models/category");
const Item = require("../models/item");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

// Display list of all items.
exports.item_list = asyncHandler(async (req, res, next) => {
  const allItems = await Item.find({})
    .populate("category")
    .sort({ category: 1, name: 1 })
    .exec();

  console.log(allItems);

  res.render("items_list", {
    title: "Items List",
    items_list: allItems,
  });
});

// Display detail page for a specific Item.
exports.item_detail = asyncHandler(async (req, res, next) => {
  // Get details of genre and all associated books (in parallel)
  const item = await Item.findById(req.params.id).populate("category").exec();

  if (item === null) {
    // No results.
    const err = new Error("Item not found");
    err.status = 404;
    return next(err);
  }

  res.render("item_detail", {
    title: "Item Detail",
    item: item,
  });
});

// Display Item create form on GET.
exports.item_create_get = asyncHandler(async (req, res, next) => {
  const allCategories = await Category.find({}, "name").exec();

  res.render("item_form", {
    title: "Create a new item",
    categories: allCategories,
  });
});

// Handle Item create on POST.
exports.item_create_post = [
  body("name", "Item name must contain at least 1 character")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("description", "Item description must contain at least 3 characters")
    .trim()
    .isLength({ min: 3 })
    .escape(),
  body("category", "Category must be specified")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("gender").escape(),
  body("size", "Item size must contain at least 1 character")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("color", "Item color must contain at least 1 character")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("brand", "Item brand must contain at least 1 character")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body(
    "price",
    "Item quantity must contain at least 1 character and be a number"
  )
    .trim()
    .isNumeric()
    .isLength({ min: 1 })
    .escape(),
  body(
    "quantity_in_stock",
    "Item price must contain at least 1 character and be a number"
  )
    .trim()
    .isNumeric()
    .isLength({ min: 1 })
    .escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const item = new Item({
      name: req.body.name,
      description: req.body.description,
      brand: req.body.brand,
      color: req.body.color,
      size: req.body.size,
      gender: req.body.gender,
      category: req.body.category,
      price: req.body.price,
      quantity_in_stock: req.body.quantity_in_stock,
    });

    if (!errors.isEmpty()) {
      const categories = await Category.find().exec();
      res.render("item_form", {
        title: "Create a new item",
        item: item,
        categories: categories,
        errors: errors.array(),
      });
      return;
    } else {
      const itemExists = await Item.findOne({
        name: req.body.name,
      }).exec();
      if (itemExists) {
        res.redirect(itemExists.url);
      } else {
        await item.save();
        res.redirect(item.url);
      }
    }
  }),
];

// Display Item delete form on GET.
exports.item_delete_get = asyncHandler(async (req, res, next) => {
  const item = await Item.findById(req.params.id).populate("category").exec();

  if (item === null) {
    res.redirect("/inventory/items");
  }

  res.render("item_delete", {
    title: "Delete Item",
    item: item,
  });
});

// Handle Item delete on POST.
exports.item_delete_post = asyncHandler(async (req, res, next) => {
  const item = await Item.findById(req.params.id).populate("category").exec();
  const itemCategoryLink = item.category.url;
  if (item === null) {
    res.redirect("/inventory/items");
  }

  await Item.findByIdAndDelete(req.body.itemid);
  res.redirect(itemCategoryLink);
});

// Display Item update form on GET.
exports.item_update_get = asyncHandler(async (req, res, next) => {
  const [item, categories] = await Promise.all([
    Item.findById(req.params.id).populate("category").exec(),
    Category.find().exec(),
  ]);

  if (item === null) {
    const err = new Error("item not found");
    err.status = 404;
    return next(err);
  }

  res.render("item_form", {
    title: "Update Item",
    categories: categories,
    item: item,
  });
});

// Handle Item update on POST.
exports.item_update_post = [
  body("name", "Item name must contain at least 1 character")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("description", "Item description must contain at least 3 characters")
    .trim()
    .isLength({ min: 3 })
    .escape(),
  body("category", "Category must be specified")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("gender").escape(),
  body("size", "Item size must contain at least 1 character")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("color", "Item color must contain at least 1 character")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("brand", "Item brand must contain at least 1 character")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body(
    "price",
    "Item quantity must contain at least 1 character and be a number"
  )
    .trim()
    .isNumeric()
    .isLength({ min: 1 })
    .escape(),
  body(
    "quantity_in_stock",
    "Item price must contain at least 1 character and be a number"
  )
    .trim()
    .isNumeric()
    .isLength({ min: 1 })
    .escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const item = new Item({
      name: req.body.name.toString(),
      description: req.body.description,
      brand: req.body.brand.toString(),
      color: req.body.color,
      size: req.body.size,
      gender: req.body.gender,
      category: req.body.category,
      price: req.body.price,
      quantity_in_stock: req.body.quantity_in_stock,
      _id: req.params.id,
    });

    if (!errors.isEmpty()) {
      const categories = await Category.find().exec();
      res.render("item_form", {
        title: "Update Item",
        item: item,
        categories: categories,
        errors: errors.array(),
      });
      return;
    } else {
      const theitem = await Item.findByIdAndUpdate(req.params.id, item, {});
      res.redirect(theitem.url);
    }
  }),
];
