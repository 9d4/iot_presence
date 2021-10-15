const bcrypt = require("bcryptjs");
const querystring = require("query-string");
const User = require("../models/User");
const saltRound = 0xa;
const rootUsers = ["traperwaze", "traper"];

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

      const destination = req.session.intendedRoute ?? "/";

      res.redirect(destination);
    } else {
      res.redirect("/login");
    }
  }
};

/**
 * function verifyRootUser
 * @param {import('express').Request} req
 * @returns boolean
 */
function verifyRootUser(req) {
  if (req.session.loggedIn && rootUsers.includes(req.session.username)) {
    return true;
  }

  return false;
}

/**
 * function new_user
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
exports.new_user = async function (req, res, next) {
  if (await verifyRootUser(req)) {
    res.render("auth/new-user");
    return;
  }

  res.status(403).send("403");
};

/**
 * function new_user_post
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
exports.new_user_post = async function (req, res, next) {
  let form = req.body;
  let user = User.create({
    name: form.name,
    username: form.username,
    password: await hashPassword(form.password),
  }).then(function () {
    res.locals.new_user_success = true;
    res.redirect("/login/new");
  });
};
