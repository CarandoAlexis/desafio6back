import express from "express";
import mongoose from "mongoose";
import handlebars from "express-handlebars";
import viewsRouter from "./routes/views.router.js";
import __dirname from "./utils.js";
import productsRouter from "./routes/products.router.js";
import displayRoutes from "express-routemap";
import cookieParser from "cookie-parser";
import session from "express-session";
import sessionRouter from "./routes/session.router.js"
import authMdw from "./middleware/auth.middleware.js";
import mongoStore from "connect-mongo";
import passport from "passport";
import initializePassport from "./config/passport-config.js";


const app = express();
const port = 8080;
app.use(express.static(`${__dirname}/public`));
app.engine("handlebars", handlebars.engine());
app.set("views", `${__dirname}/views`);
app.set("view engine", "handlebars");
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/", viewsRouter);
app.use("/api/products", productsRouter); 

app.use(session({
  store: mongoStore.create({
  mongoUrl: 'mongodb+srv://alexiscarando:u7Y4zRGys6yAY6xC@cluster0.qoopwxe.mongodb.net/ecommerce',
  mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
  ttl: 60*3600,
  }),
  secret: "alexisSession",
  resave: false,
  saveUninitialized: false,
}))

initializePassport();
app.use(passport.initialize());

const connection = mongoose
  .connect('mongodb+srv://alexiscarando:u7Y4zRGys6yAY6xC@cluster0.qoopwxe.mongodb.net/ecommerce')
  .then((conn) => {
  })
  .catch((err) => {
  });

//redirecciona directo al register por motivos practicos nada mas
app.get("/", (req, res) => {
    res.redirect("/register");
});
    
app.use("/products", authMdw , (req, res, next) => {
  return res.render("productList");
});
    
app.use("/api/session/", sessionRouter);
    

app.listen(port, () => {
  displayRoutes(app);
  console.log(`Server listening on port ${port}`);
}); 

