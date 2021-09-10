import express from "express";

const PORT = 3000;

const app = express();

const loggerMiddleware = (req, res, next) => {
  console.log(`${req.method}: ${req.url}`);
  next();
};
const privateMiddleware = (req, res, next) => {
  const url = req.url;
  if (url === "/protected") {
    return res.send("<h1>Not Allowed</h1>");
  }
  next();
};
const redirectMiddleware = (req, res, next) => {
  console.log("You can't enter there");
  return res.redirect("/");
};

const handleHome = (req, res) => res.send("<h1>Welcome</h1>");
const handleLogin = (req, res) => res.send("Login Here");

// Global middleware
app.use(loggerMiddleware, privateMiddleware);

app.get("/", handleHome);
app.get("/login", handleLogin);

app.use(redirectMiddleware);

const handleListening = () =>
  console.log(`Listening on http://localhost:${PORT} ✅`);

app.listen(PORT, handleListening);
