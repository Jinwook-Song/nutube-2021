import express from "express";

const PORT = 3000;

const app = express();

const loggerMiddleware = (req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
};
const privateMiddleware = (req, res, next) => {
  const url = req.url;
  if (url === "/protected") {
    return res.send("<h1>Not Allowed</h1>");
  }
  next();
};

// Global middleware
app.use(loggerMiddleware);
app.use(privateMiddleware);

app.get("/", (req, res) => res.send("Welcome"));
app.get("/login", (req, res) => res.send("Login Here"));

const handleListening = () => {
  console.log(`Listening on http://localhost:${PORT} ✅`);
};
app.listen(PORT, handleListening);
