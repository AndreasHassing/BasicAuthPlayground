const {
  parseBasicAuthorizationHeader,
  AuthenticationError,
} = require("./basic-auth-parser");
const { compare } = require("./argon2i-password-hasher");
const generateCryptoRandomString = require("./crypto-random-string");

const expireSessionAfterMilliseconds = 30 * 24 * 60 * 60 * 1000;

const SessionCookieName = ".basic.authentication.session";

const KnownUserCredentials = {
  ["user@example.com"]: {
    passwordHash:
      // this is an argon2i hash of the password: "my password", using a locally generated pepper
      "$argon2i$v=19$m=4096,t=420,p=1$nfmMniX0G7ukqPZFON0Q5yWLH5Wv9Ly3qcx4/PZk31s09qvQ0wuzCcWGG1D+DhR0gd/ccyN7brXIeneE0RrmO1+hRUn+zQz1xf+FDi2Zn1ZGg6MA42wmbHrk4vDWXXUWyQP7G2Jqt14aNvbHtb7/fEgzlBfiaWM7IVHbtqM8SVo$9HezOZOah6Mm9CSZuE+lpRK87K3Y4YQGI4myOHqi8RIeL5QFlWWSHgFfO1B5Uow8cYqW9PZO7ehp3QlUcLEzw6DF41aWHu/+DkEF2Jf1K9yG7qxGyTS7yscp0xFtTPLZebn10Rg6ttxeEi5lA2FxnkMp4r+0rsQFuijn4zeOwjo",
  },
};

const userSessions = {};

const ensureAuthenticated = async (req, res, next) => {
  const authorizationHeader = req.get("authorization");
  delete req.headers["authorization"];

  const authenticated = (username) => {
    req.auth = {
      isAuthenticated: true,
      username: username,
    };

    return next();
  };

  const sessionId = req.cookies[SessionCookieName];

  if (
    sessionId &&
    sessionId in userSessions &&
    userSessions[sessionId].expiresAt > new Date()
  ) {
    return authenticated(userSessions[sessionId].username);
  } else if (authorizationHeader) {
    try {
      const credentials = parseBasicAuthorizationHeader(authorizationHeader);

      if (credentials.username in KnownUserCredentials) {
        const passwordMatches = await compare(
          credentials.password,
          KnownUserCredentials[credentials.username].passwordHash
        );

        if (passwordMatches) {
          const sessionExpiresAt = new Date(
            new Date().getTime() + expireSessionAfterMilliseconds
          );

          const sessionId = await generateCryptoRandomString();

          userSessions[sessionId] = {
            username: credentials.username,
            expiresAt: sessionExpiresAt,
          };

          res.cookie(SessionCookieName, sessionId, {
            maxAge: expireSessionAfterMilliseconds,
            httpOnly: true,
          });

          return authenticated(credentials.username);
        }
      }
    } catch (ex) {
      if (ex instanceof AuthenticationError) {
        console.error(ex);

        return res.status(401).send({ error: { [ex.name]: ex.message } });
      }

      throw ex;
    }
  }

  res.set(
    "WWW-Authenticate",
    'Basic realm="Authenticated Realm", charset="UTF-8"'
  );

  return res.status(401).send();
};

module.exports = ensureAuthenticated;
