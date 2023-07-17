#! /usr/bin/env node

console.log("This script populates some test categories and items");

// Get arguments passed on command line
const userArgs = process.argv.slice(2);

const Item = require("./models/item");
const Category = require("./models/category");

const items = [];
const categories = [];

const mongoose = require("mongoose");
mongoose.set("strictQuery", false); // Prepare for Mongoose 7

const mongoDB = userArgs[0];

main().catch((err) => console.log(err));

async function main() {
  console.log("Debug: About to connect");
  await mongoose.connect(mongoDB);
  console.log("Debug: Should be connected?");

  await createCategories();
  await createItems();
  console.log("Debug: Closing mongoose");
  mongoose.connection.close();
}

// We pass the index to the ...Create functions so that, for example,
// genre[0] will always be the Fantasy genre, regardless of the order
// in which the elements of promise.all's argument complete.
async function categoryCreate(index, name, description) {
  const category = new Category({ name: name, description: description });
  await category.save();
  categories[index] = category;
  console.log(`Added category: ${name}`);
}

async function itemCreate(
  index,
  name,
  brand,
  color,
  size,
  gender,
  description,
  category,
  price,
  quantity
) {
  const item = new Item({
    name: name,
    brand: brand,
    color: color,
    size: size,
    gender: gender,
    description: description,
    price: price,
    quantity_in_stock: quantity,
    category: category,
  });

  await item.save();
  items[index] = item;
  console.log(`Added  item: ${name} ${brand}`);
}

async function createCategories() {
  console.log("Adding categories");
  await Promise.all([
    categoryCreate(
      0,
      "Dresses",
      "In this category you can find all our dresses."
    ),
    categoryCreate(1, "Hats", "In this category you can find all our hats."),
    categoryCreate(
      2,
      "Shirts",
      "In this category you can find all our shirts."
    ),
  ]);
}

async function createItems() {
  console.log("Adding items");
  await Promise.all([
    itemCreate(
      0,
      '"Amelie" Junior Bridesmaid Dress',
      "JJ's House",
      "Champagne",
      "158",
      "Girls",
      "A-line Cold Shoulder Asymmetrical Chiffon Junior Bridesmaid Dress",
      categories[0],
      48,
      7
    ),
    itemCreate(
      1,
      '"Amelie" Junior Bridesmaid Dress',
      "JJ's House",
      "Champagne",
      "164",
      "Girls",
      "A-line Cold Shoulder Asymmetrical Chiffon Junior Bridesmaid Dress",
      categories[0],
      48,
      3
    ),
    itemCreate(
      2,
      '"Amelie" Junior Bridesmaid Dress',
      "JJ's House",
      "Lilac",
      "146",
      "Girls",
      "A-line Cold Shoulder Asymmetrical Chiffon Junior Bridesmaid Dress",
      categories[0],
      48,
      1
    ),
    itemCreate(
      3,
      "Pocket Button Up Shirt",
      "Lipsy",
      "White",
      "S",
      "Women",
      "Long sleeve linen button up shirt from Lipsy. A perfect, simple piece available in bold and classic colours to upgrade your wardrobe. 100% Cotton.",
      categories[2],
      30,
      5
    ),
    itemCreate(
      4,
      "Short Sleeve Linen Cotton Shirt ",
      "Next",
      "Pink",
      "3m",
      "Baby boys",
      "Short sleeve linen button up shirt from Next. Machine washable. 55% Linen, 45% Cotton.",
      categories[2],
      12,
      11
    ),
    itemCreate(
      5,
      "Baseball Hat with logo",
      "Gap",
      "Brown",
      "Adult",
      "Men",
      "Soft 6-panel baseball cap. Gap arch logo at front. Curved brim. Adjustable buckle closure at back. 100% Cotton.",
      categories[1],
      18,
      8
    ),
  ]);
}

console.log(categories);
