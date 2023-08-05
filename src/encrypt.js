import bcrypt from "bcrypt";
// Crea un hash a partir del valor proporcionado (para almacenar contraseñas de forma segura)
const createHashValue = async (val) => {
  const salt = await bcrypt.genSalt();
  return await bcrypt.hash(val, salt);
};
// Verifica si la contraseña sin encriptar coincide con el hash almacenado
const isValidPasswd = async (psw, encryptedPsw) => {
  return await bcrypt.compare(psw, encryptedPsw);
};

export { createHashValue, isValidPasswd };