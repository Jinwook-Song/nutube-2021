import express from "express";
import morgan from "morgan";

const PORT = 3000;

const app = express();
const logger = morgan("dev");

const handleHome = (req, res) => res.send("<h1>Welcome</h1>");
const handleLogin = (req, res) => res.send("Login Here");

app.use(logger);

app.get("/", handleHome);
app.get("/login", handleLogin);

const handleListening = () =>
  console.log(`Listening on http://localhost:${PORT} ✅`);

app.listen(PORT, handleListening);
