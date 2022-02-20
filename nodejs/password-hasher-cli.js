const {
  hashPassword: bcryptHashPassword,
} = require("./bcrypt-password-hasher");
const {
  hashPassword: argonHashPassword,
} = require("./argon2i-password-hasher");

async function main(type, password) {
  console.log(
    `hashing password: "${password}" with pepper: "${process.env.PEPPER}" using ${type}`
  );

  console.time("time-to-hash");
  let hash;
  if (type === "bcrypt") {
    hash = await bcryptHashPassword(password);
  } else if (type === "argon") {
    hash = await argonHashPassword(password);
  } else {
    throw new Error("only know bcrypt and argon hashing algorithms");
  }
  console.timeEnd("time-to-hash");

  console.log(`hash: "${hash}"`);
}

main(process.argv[2], process.argv[3]);
