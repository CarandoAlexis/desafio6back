import ProductModel from "../models/products.model.js";
import CartModel from "../models/carts.model.js";

class MongoProductManager {
  async addProduct(productData) {
    try {
      const product = new ProductModel(productData);
      await product.save();
    } catch (error) {
      console.error("Error al agregar el producto:", error);
      throw error;
    }
  }

  async getProducts() {
    try {
      const products = await ProductModel.find();
      return products;
    } catch (error) {
      console.error("Error al obtener los productos:", error);
      throw error;
    }
  }
}

export default MongoProductManager;