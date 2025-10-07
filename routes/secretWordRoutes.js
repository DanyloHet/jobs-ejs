
const express = require("express");
const router = express.Router();

router.get("/secretWord", (req, res) => {
  if (!req.session.secretWord) {
    req.session.secretWord = "syzygy";
  }
  res.locals.info = req.flash("info");
  res.locals.errors = req.flash("error");
  res.render("secretWord", { secretWord: req.session.secretWord });
});

router.post("/secretWord", (req, res) => {
  const newSecretWord = req.body.secretWord;

  if (newSecretWord.toUpperCase()[0] === "P") {
    req.flash("error", "That word won't work!");
    req.flash("error", "You can't use words that start with 'P'.");
  } else {
    req.session.secretWord = newSecretWord;
    req.flash("info", "The secret word was successfully changed.");
  }

  res.redirect("/secretWord");
});

module.exports = router;
