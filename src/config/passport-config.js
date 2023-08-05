import passport from "passport";
import userModel from "../dao/models/user.model.js";
import { Strategy as GitHubStrategy } from "passport-github2";
import { Strategy as LocalStrategy } from "passport-local";


const initializePassport = () =>{
 // Configuro la autenticacion local
  passport.use(
    "local",
    new LocalStrategy(async (email, password, done) => {
      try {
        const user = await userModel.findOne({ email });

        if (!user) {
          return done(null, false, { message: "Usuario no registrado/existente" });
        }

        const isPasswordValid = await isValidPasswd(password, user.password);

        if (!isPasswordValid) {
          return done(null, false, { message: "Contraseña incorrecta" });
        }

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    })
  );
    
passport.use(
  "github",  
  // Estrategia de autenticación de GitHub
  new GitHubStrategy(
    {
      clientID: "62d22892577df5fee2b8",
      clientSecret: "96c23ce9cf9e44b08cb5f640f22f1510c43c1ec1",
      callbackURL: "http://localhost:8080/api/session/github/callback", // La misma URL que ingresaste en GitHub como "Authorization callback URL"
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log("Info de perfil", profile);
        let user = await userModel.findOne({ email: profile._json?.email });
        if (!user) {
          let addNewUser = {
            first_name: profile._json.name,
            last_name: "",
            email: profile._json?.email,
            age: 0,
            password: "",
            githubId: profile.id, // Agrega el githubId al nuevo usuario
            username: profile.username, // Agrega el username al nuevo usuario
          };
          let newUser = await userModel.create(addNewUser);
          done(null, newUser);
        } else {
          // ya existia el usuario
          done(null, user);
        }
      } catch (error) {
        return done(error);
      }
    }
    
  )

);

// Serializa al usuario para almacenar en la sesión
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserializa al usuario para obtenerlo de la sesión
passport.deserializeUser(async (id, done) => {
  try {
    const user = await userModel.findById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});



};

export default initializePassport;