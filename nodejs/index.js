const cookieParser = require("cookie-parser");
const express = require("express");
const ensureAuthenticated = require("./basic-authentication-middleware");

const app = express();
const port = 3000;

app.use((req, res, next) => {
  // for security purposes - do not reveal the innards of the beast
  res.removeHeader("X-Powered-By");

  return next();
});
app.use(cookieParser());
app.use(ensureAuthenticated);

app.get("/", (req, res) => {
  res.send(`Hello ${req.auth.username}!`);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
