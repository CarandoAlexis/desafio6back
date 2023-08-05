La logica del proyecto se encuentra realizada dentro de los siguientes archivos:
dao/models/user.model.js
middleware/auth.middleware.js
routes/session.router.js
router/views.router.js
app.js
y las vistas en handlebars estan dentro de views

A continuacion se detallan las rutas disponibles:

Registro de usuarios:

Método: POST
Ruta: /api/session/register
Descripción: Permite registrar un nuevo usuario en el sistema.
La solicitud debe realizarse en postman en formato JSON a través del cuerpo (body) con los siguientes campos:
first_name: Nombre del usuario (String, requerido).
last_name: Apellido del usuario (String, requerido).
email: Correo electrónico del usuario (String, requerido).
age: Edad del usuario (Number, requerido).
password: Contraseña del usuario (String, requerido).

Inicio de sesión:

Método: POST
Ruta: /api/session/login
Descripción: Permite que un usuario inicie sesión en el sistema.
La solicitud debe realizarse en postman en formato JSON a través del cuerpo (body) con los siguientes campos:
email: Correo electrónico del usuario (String, requerido).
password: Contraseña del usuario (String, requerido).

Cierre de sesión:

Método: GET
Ruta: /api/session/logout
Descripción: Permite que un usuario cierre sesión en el sistema.
No es necesario ingresar ningun campo

Todas estas pruebas se pueden realizar en navegador tambien en las rutas por ejemplo con puerto 8080:

http://localhost:8080/register

http://localhost:8080/login

Al iniciar sesión dentro de /login hay un boton debajo para hacer la prueba del logout que luego te redirige a /login

Al registrar la cuenta adminCoder@coder.com con password=admin se tomara de forma predeterminada el rol de admin
De lo contrario se tomara el rol predeterminado de usuario

En este caso me di cuenta despues que quizas no deberia tener una contraseña especifica para tomar el rol de admin sino que solo el correo pero en la consigna lo comprendi como que era así asique lo deje de esa forma
