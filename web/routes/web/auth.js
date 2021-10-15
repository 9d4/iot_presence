const { Router } = require("express");
const {
  authenticate,
  new_user,
  new_user_post,
} = require("../../app/controllers/authController");
const { unLogged, loggedIn } = require("../../app/middleware/auth");
const router = (module.exports = Router());

router.get("/login", unLogged, async function (req, res) {
  res.render("auth/login");
});

router.all("/logout", loggedIn, async function (req, res) {
  req.session.destroy((err) => null);
  res.redirect("/");
});

router.post("/login", authenticate);

router.get("/login/new", new_user);
router.post("/login/new", new_user_post);