import bcrypt from "bcryptjs";

const hashPassword = async (password) => {
  try {
    const saltRound = 12;
    return bcrypt.hash(password, saltRound);
  }catch(e) {
    throw new Error(e);
  }
}

const comparePassword = async (password, storedPassword) => {
  return bcrypt.compare(password, storedPassword);
}

export default {
  hashPassword,
  comparePassword
}