import { Router } from "express";
import Product from "../dao/models/products.model.js"

const router = Router();

router.get("/", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const sort = req.query.sort === "desc" ? -1 : 1;
    const query = req.query.query || "";

    // Construir el objeto de filtro
    const filter = {};
    if (query) {
      filter.$or = [
        { category: { $regex: query, $options: "i" } },
        { availability: { $regex: query, $options: "i" } },
      ];
    }

   
    // Obtener los productos según los parámetros de la consulta
    const products = await Product.find(filter)
      .sort({ price: sort })
      .limit(limit)
      .lean();

    // Resto de la lógica para enviar los datos al cliente, renderizar una vista, etc.

    res.json(products);
  } catch (error) {
    console.error("Error al obtener los productos:", error);
    res.status(500).json({ status: "error", message: "Error al obtener los productos" });
  }
});

router.post("/", async (req, res) => {
  try {
    // Obtén los datos del producto desde el cuerpo de la solicitud
    const { title, description, price, code, category } = req.body;

    // Crea un nuevo documento de producto utilizando el modelo Product
    const newProduct = new Product({
      title,
      description,
      price,
      code,
      category,
    });

    // Guarda el nuevo producto en la base de datos
    await newProduct.save();

    res.status(201).json({ status: "success", message: "Producto agregado exitosamente" });
  } catch (error) {
    console.error("Error al agregar el producto:", error);
    res.status(500).json({ status: "error", message: "Error al agregar el producto" });
  }
});

export default router;