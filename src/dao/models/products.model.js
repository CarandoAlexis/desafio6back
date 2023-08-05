import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  code: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
});

const Product = mongoose.model("products", productSchema);

export default Product;