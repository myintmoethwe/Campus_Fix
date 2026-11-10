const express = require("express");
const pool = require("./config/db");

const authRoute = require("./routes/authRoute");
const app = express();

app.use(express.json());

app.use("/api/auth", authRoute);

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
