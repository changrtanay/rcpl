const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDb = require("./config/db");
const router = require("./routes");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const passport = require("passport");
const passportConfig = require("./config/passport");
// const bodyParser = require('body-parser');
// const stripeWebhook = require('./controller/stripeWebhook');
// const authToken = require("./middleware/authToken");
// const paymentController = require("./controller/payment");


const app = express();
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser());

// Session configuration
app.use(
  session({
    secret: "abc",
    resave: false,
    saveUninitialized: true,
  })
);

// Passport initialization
app.use(passport.initialize());
app.use(passport.session());

// Passport strategy configuration
passportConfig(passport);

app.use("/api", router);

// app.use(bodyParser.json({
//   verify: (req, res, buf) => {
//     req.rawBody = buf;
//   }
// }));

// app.post('/api/stripe-webhook', stripeWebhook);


// app.post("/api/payment", authToken, bodyParser.raw({ type: 'application/json' }), paymentController);
// app.post('/api/stripe-webhook', bodyParser.raw({ type: 'application/json' }), stripeWebhook);


// Initial Google OAuth login
app.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Google OAuth callback
app.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: `${process.env.FRONTEND_URL}/sign-in` }),
  (req, res) => {
    const { user, token, tokenOption } = req.user;
    res.cookie('token', token, tokenOption).redirect(`${process.env.FRONTEND_URL}/`);
  }
);


const PORT = 8080 || process.env.PORT;

connectDb().then(() => {
  app.listen(PORT, () => {
    console.log("Connected to db");
    console.log("Server is running");
  });
});
