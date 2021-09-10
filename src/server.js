import express from "express";

const PORT = 3000;

const app = express();

app.get("/", (req, res) => res.send("Welcome"));
app.get("/login", (req, res) => res.send("Login Here"));

const handleListening = () => {
  console.log(`Listening on http://localhost:${PORT} ✅`);
};
app.listen(PORT, handleListening);
