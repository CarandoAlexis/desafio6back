import { Router } from "express";
import userModel from "../dao/models/user.model.js";
import Product from '../dao/models/products.model.js';
import { createHashValue, isValidPasswd } from '../encrypt.js';
import passport from "passport";

const router = Router();

router.post("/register", async (req, res) => {
  try {
    console.log("BODY ****", req.body);
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
      "🚀 ~ file: session.routes.js:61 ~ router.post ~ newUser:",
      newUser
    );

    req.session.user = { email, first_name, last_name, age };
    return res.render(`login`);
  } catch (error) {
    console.log(
      "🚀 ~ file: session.routes.js:36 ~ router.post ~ error:",
      error
    );
  }
});
/*
router.post("/register", async (req, res) => {
  try {
    const body = req.body;

    // Verifica si el correo electrónico ya existe en la base de datos
    const existingUser = await userModel.findOne({ email: body.email });

    if (existingUser) {
      // Si el correo electrónico ya existe, envia un mensaje de error
      return res.redirect("/register?error=El correo electrónico ya está registrado");
    }

    // Verifica si el usuario a registrar es el administrador
    const isAdmin = body.email === "adminCoder@coder.com" && body.password === "adminCod3r123";

    // Hashea la contraseña antes de guardarla en la base de datos
    const pswHashed = await createHashValue(body.password);

    // Agrega el rol "admin" si es el administrador, de lo contrario, agrega "usuario"
    const newUser = await userModel.create({
      ...body,
      password: pswHashed, // Guarda la contraseña hasheada en la base de datos
      role: isAdmin ? "admin" : "usuario",
    });

    console.log("nuevo usuario:", newUser);

    req.session.user = { ...newUser.toObject() };
    return res.redirect("/login");
  } catch (error) {
    console.log("error:", error);
    
    res.status(500).json({ message: "Error al registrar el usuario" });
  }
});
*/
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
    console.log(`****** USANBO ENDPOINT CON STRATEGIA DE GITHUB *****`);
  }
);

// Ruta para manejar el callback de GitHub después de la autenticación
router.get(
  "/github/callback/",
  passport.authenticate("github", { failureRedirect: "/login" }),
  async (req, res) => {
    try {
      // La autenticación con GitHub ha sido exitosa.
      // Aquí obtienes los datos del usuario autenticado a través de req.user
      const githubUser = req.user;

      // Verifica si el usuario existe en la base de datos a través del githubId
      let findUser = await userModel.findOne({ githubId: githubUser.id });

      if (!findUser) {
        // Si el usuario no existe en la base de datos, crea uno nuevo con los datos de GitHub
        findUser = await userModel.create({
          githubId: githubUser.id,
          username: githubUser.username,
          // Puedes agregar más información del perfil de GitHub que desees guardar en la base de datos.
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
