const generateCryptoRandomString = require("./crypto-random-string");

async function main() {
  console.log(`pepper: ${await generateCryptoRandomString()}`);
  console.log('place that in .env as PEPPER="<the above value>"');
}

main();
