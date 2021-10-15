/**
 * function loggedIn
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
exports.loggedIn = function loggedIn(req, res, next) {
  if (req.session.loggedIn) {
    next();
  } else {
    req.session.intendedRoute = req.originalUrl;
    res.redirect("/login");
  }
};

/**
 * function unLogged
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
exports.unLogged = function (req, res, next) {
  if (!req.session.loggedIn) {
    next();
  } else {
    res.redirect("/");
  }
};
