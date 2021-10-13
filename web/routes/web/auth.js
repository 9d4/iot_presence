const { Router } = require("express");
const { authenticate } = require("../../app/controllers/authController");
const router = (module.exports = Router());

router.get("/login", async function (req, res) {
  if (req.session.loggedIn === true) {
    res.redirect("/");
  }
  res.render("auth/login");
});

router.all("/logout", async function (req, res) {
    if (!req.session.loggedIn) {
        res.redirect('/login')
    }

    req.session.destroy((err) => null);
    res.redirect('/');
});

router.post("/login", authenticate);
