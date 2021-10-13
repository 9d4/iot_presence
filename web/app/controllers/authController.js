const bcrypt = require("bcryptjs");
const querystring = require("query-string");
const User = require("../models/User");
const saltRound = 0xa;

async function hashPassword(passwd) {
  let result = await bcrypt.hash(passwd, saltRound);
  return result;
}

async function checkPassword(hashed, plain) {
  let result = bcrypt.compare(plain, hashed);
  return result;
}

/**
 * function authenticate
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
exports.authenticate = async function (req, res, next) {
  const form = req.body;
  if (!(form.hasOwnProperty("username") && form.hasOwnProperty("password")))
    res.redirect(
      "/login?" +
        querystring.stringify({
          success: false,
          username: false,
          password: false,
        })
    );

  // find user by username
  const user = await User.findOne({ username: form.username }).lean();

  if (user === null) {
    res.redirect("/login");
  } else {
    // validate password
    const passwordMatch = await checkPassword(user.password, form.password);

    if (passwordMatch) {
      res.locals.username = form.username;
      req.session.loggedIn = true;
      req.session.username = res.locals.username;

      res.redirect("/");
    } else {
      res.redirect("/login");
    }
  }
};
