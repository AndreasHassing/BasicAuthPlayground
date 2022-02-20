const bcrypt = require("bcrypt");

const saltRounds = 14;

const hashPassword = async (password) => {
  const pepper = process.env.PEPPER;

  const hash = await bcrypt.hash(password + pepper, saltRounds);

  return hash;
};

const compare = async (password, hash) => {
  const pepper = process.env.PEPPER;

  return await bcrypt.compare(password + pepper, hash);
};

module.exports = {
  hashPassword,
  compare,
};
