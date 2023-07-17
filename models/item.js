const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ItemSchema = new Schema({
  name: { type: String, required: true },
  brand: { type: String, required: true },
  color: { type: String, required: false },
  size: { type: String, required: true },
  gender: {
    type: String,
    required: true,
    enum: ["Men", "Women", "Girls", "Boys", "Baby girls", "Baby boys"],
    default: "Men",
  },
  description: { type: String, required: true },
  category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
  price: { type: Number, min: 0, required: true },
  quantity_in_stock: { type: Number, min: 0, required: true },
});

ItemSchema.virtual("url").get(function () {
  return `/inventory/item/${this._id}`;
});

ItemSchema.virtual("full_name").get(function () {
  if (this.color) {
    return `${this.brand} ${this.name} ${this.color}`;
  } else {
    return `${this.brand} ${this.name}`;
  }
});

module.exports = mongoose.model("Item", ItemSchema);
