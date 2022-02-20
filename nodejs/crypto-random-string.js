const generateCryptoRandomString = async () => {
  const cryptoRandomString = await import("crypto-random-string");

  return cryptoRandomString.default({ length: 64 });
};

module.exports = generateCryptoRandomString;
