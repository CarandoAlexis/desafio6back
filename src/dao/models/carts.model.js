import mongoose from "mongoose";
import Product from "./products.model.js";

const cartSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  products: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "products",
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        default: 1,
      },
    },
  ],
});

const CartModel = mongoose.model("carts", cartSchema);

export default CartModel;