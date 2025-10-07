const storeLocals = (req, res, next) => {
  if (req.user) {
    res.locals.user = req.user;
  } else {
    res.locals.user = null;
  }
  if (req._parsedOriginalUrl.path === "/") {
    res.locals.info = req.flash("info");
    res.locals.errors = req.flash("error");
  }

  next();
};

module.exports = storeLocals;
