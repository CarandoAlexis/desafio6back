import { Router } from "express";
import userModel from "../dao/models/user.model.js";
import Product from '../dao/models/products.model.js';
import { createHashValue, isValidPasswd } from '../encrypt.js';
import passport from "passport";

const router = Router();

router.post("/register", async (req, res) => {
  try {
    console.log("Body", req.body);
    const { first_name, last_name, email, age, password } = req.body;

    const pswHashed = await createHashValue(password);

    const userAdd = {
      email,
      password,
      first_name,
      last_name,
      age,
      password: pswHashed,
    };
    const newUser = await userModel.create(userAdd);
    console.log(
      "newUser:",
      newUser
    );

    req.session.user = { email, first_name, last_name, age };
    return res.render(`login`);
  } catch (error) {
  }
});

router.post("/login", async (req, res) => {
  try {
    // Para validar el login con email y contraseña
    const { email, password } = req.body;

    // Para obtener la sesión actual
    const session = req.session;

    const findUser = await userModel.findOne({ email });

    if (!findUser) {
      return res.status(401).json({ message: "Usuario no registrado/existente" });
    }

    // Verifica si la contraseña es valida utilizando isValidPasswd
    const isPasswordValid = await isValidPasswd(password, findUser.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }

    // Verifica el rol del usuario
    if (findUser.email === "adminCoder@coder.com" && findUser.password === "admin") {
      findUser.role = "admin";
    } else {
      findUser.role = "usuario";
    }

    // Establece el usuario en la sesión
    req.session.user = {
      ...findUser.toObject(),
      password: "",
    };

    console.log("Usuario establecido en la sesión:", session.user);

    // Para obtener todos los productos
    const products = await Product.find().lean();

    // Renderiza la vista de perfil con los datos del usuario y los productos
    return res.render("profile", {
      // Utiliza los datos obtenidos de la base de datos directamente
      first_name: findUser.first_name,
      last_name: findUser.last_name,
      email: findUser.email,
      age: findUser.age,
      role: findUser.role,
      products,
    });
  } catch (error) {
    console.error("Error al obtener los datos del usuario:", error);
    res.status(500).json({ status: "error", message: "Error al obtener los datos del usuario" });
  }
});

router.get("/logout", async (req, res) => {
  req.session.destroy((err) => {
    if (!err) return res.redirect("/login");
    return res.send({ message: `logout Error`, body: err });
  });
});

// Ruta para iniciar el proceso de autenticación de GitHub
router.get(
  "/github",
  passport.authenticate("github"),
  async (req, res) => {
    console.log("endpoint estrategia github");
  }
);

// Ruta para manejar el callback de GitHub después de la autenticación
router.get(
  "/github/callback/",
  passport.authenticate("github", { failureRedirect: "/login" }),
  async (req, res) => {
    try {
      const githubUser = req.user;
      // Verifica si el usuario existe en la base de datos a través del githubId
      let findUser = await userModel.findOne({ githubId: githubUser.id });
      if (!findUser) {
        // Si el usuario no existe en la base de datos, crea uno nuevo con los datos de GitHub
        findUser = await userModel.create({
          githubId: githubUser.id,
          username: githubUser.username,
        });
      }
      // Establece la sesión del usuario
      req.session.user = {
        ...findUser.toObject(),
        password: "",
      };
      console.log("Usuario establecido en la sesión:", req.session.user);
      // Para obtener todos los productos
      const products = await Product.find().lean();
      // Renderiza la vista de perfil con los datos del usuario y los productos
      return res.render("profile", {
        role: findUser.role,
        username: findUser.username,
        products,
      });
    } catch (error) {
      console.error("Error al obtener los datos del usuario:", error);
      res.status(500).json({ status: "error", message: "Error al obtener los datos del usuario" });
    }
  }
);

export default router;
