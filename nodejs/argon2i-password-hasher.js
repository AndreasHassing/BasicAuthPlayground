const argon2 = require("argon2");

const hashPassword = async (password) => {
  const pepper = process.env.PEPPER;

  const hash = await argon2.hash(password + pepper, {
    // values recommended by https://www.password-hashing.net/argon2-specs.pdf
    type: argon2.argon2i, // argon2i is best for password hashing
    timeCost: 420, // takes around 1s on my hardware
    hashLength: 128,
    saltLength: 128,
  });

  return hash;
};

const compare = async (password, hash) => {
  const pepper = process.env.PEPPER;

  return await argon2.verify(hash, password + pepper);
};

module.exports = {
  hashPassword,
  compare,
};
