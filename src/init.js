import "regenerator-runtime";
import "dotenv/config";
import "./db";
import "./models/Video";
import "./models/User";
import "./models/Comment";
import app from "./server";

const PORT = process.env.PORT || 3000; // for heroku

const handleListening = () =>
  console.log(`✅ Listening on http://localhost:${PORT}`);

app.listen(PORT, handleListening);
