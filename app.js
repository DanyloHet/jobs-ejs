const express = require("express");
require("express-async-errors");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const csrf = require("host-csrf");
const helmet = require("helmet");
const xss = require("xss-clean");
const rateLimit = require("express-rate-limit");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const flash = require("connect-flash");
const passport = require("passport");
const passportInit = require("./passport/passportInit");
const connectDB = require("./db/connect");

const app = express();


connectDB(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
    process.exit(1);
  });


app.set("view engine", "ejs");


app.use(helmet());
app.use(xss());
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use(limiter);


app.use(cookieParser(process.env.SESSION_SECRET));
app.use(bodyParser.urlencoded({ extended: true }));


const store = new MongoDBStore({
  uri: process.env.MONGO_URI,
  collection: "mySessions",
});
store.on("error", (error) => console.log(error));

const sessionParams = {
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  store: store,
  cookie: {
    secure: false,
    sameSite: "strict",
  },
};

if (app.get("env") === "production") {
  app.set("trust proxy", 1);
  sessionParams.cookie.secure = true;
}

app.use(session(sessionParams));
app.use(flash());


passportInit();
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  try {
    res.locals._csrf = csrf.getToken(req, res);
  } catch (err) {
    res.locals._csrf = null;
  }
  next();
});


const csrfMiddleware = csrf.csrf();
app.use(csrfMiddleware);




app.use(require("./middleware/storeLocals"));


app.get("/", (req, res) => {
  res.render("index");
});
app.use("/sessions", require("./routes/sessionRoutes"));
app.use(require("./routes/secretWord"));
app.use("/jobs", require("./routes/jobs"));


app.use((err, req, res, next) => {
  if (err.name === "CSRFError") {
    return res.status(403).send("Form tampered with (CSRF token invalid).");
  }
  next(err);
});


app.use((req, res) => {
  res.status(404).send(`That page (${req.url}) was not found.`);
});


app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send(err.message);
});


const port = process.env.PORT || 3000;
const start = async () => {
  try {
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};
start();
