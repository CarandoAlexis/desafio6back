import bcrypt from "bcrypt";

const createHashValue = async (val) => {
  const salt = await bcrypt.genSalt();
  return await bcrypt.hash(val, salt);
};

const isValidPasswd = async (psw, encryptedPsw) => {
  return await bcrypt.compare(psw, encryptedPsw);
};

export { createHashValue, isValidPasswd };