const ExtendableError = require("./extendable-error");

class AuthenticationError extends ExtendableError {}

class NonBasicAuthorizationHeaderError extends AuthenticationError {
  constructor() {
    super(
      "Not authenticating with Basic authentication, missing 'Basic ' from Authorization header."
    );
  }
}

class InvalidAuthorizationHeaderSegmentCountError extends AuthenticationError {
  constructor(numberOfSegments) {
    super(
      `Authorization header contains invalid number of segments (${numberOfSegments}), expected 2: "Basic" and the base64 encoded credentials.`
    );
  }
}

class MissingUsernameOrPasswordError extends AuthenticationError {
  constructor() {
    super("Username or password is missing from base64 encoded credentials.");
  }
}

/**
 * @class Credentials
 * @type {Object}
 * @param {string} username
 * @param {string} password
 * @property {string} username
 * @property {string} password
 */
function Credentials(username, password) {
  return {
    username,
    password,
  };
}

/**
 * Parses a "authorization" header with Basic authentication details.
 * @param {string} authorizationHeader Raw authorization header from an inbound HTTP request.
 * @returns {Credentials} Parsed user credentials from the authorization header.
 * @throws {NonBasicAuthorizationHeaderError} Authorization header must start with "Basic "
 * @throws {InvalidAuthorizationHeaderSegmentCountError} Authorization header must contain at least 2 segments.
 * @throws {MissingUsernameOrPasswordError} Authorization header must contain username and password in a base64 encoded string.
 */
const parseBasicAuthorizationHeader = (authorizationHeader) => {
  if (!authorizationHeader || !authorizationHeader.startsWith("Basic ")) {
    throw new NonBasicAuthorizationHeaderError();
  }

  const splitAuthorizationHeader = authorizationHeader.split(" ");

  if (splitAuthorizationHeader.length !== 2) {
    throw new InvalidAuthorizationHeaderSegmentCountError(
      splitAuthorizationHeader.length
    );
  }

  const [scheme, encodedCredentials] = splitAuthorizationHeader;

  const decodedCredentials = Buffer.from(encodedCredentials, "base64").toString(
    "utf8"
  );

  const [username, password] = decodedCredentials.split(":");

  if (!username || !password) {
    throw new MissingUsernameOrPasswordError();
  }

  return new Credentials(username, password);
};

module.exports = {
  AuthenticationError,
  Credentials,
  parseBasicAuthorizationHeader,
};
