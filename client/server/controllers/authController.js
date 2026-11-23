const bcrypt = require("bcrypt");
const pool = require("../db");

const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required!" });
    }
    const cleanName = name.trim();
    const cleanEmail = email.trim();

    if (!cleanName || !cleanEmail) {
      return res
        .status(400)
        .json({ message: "Name And Email cannot br empty!" });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      return res.status(400).json({ message: "Invalid email format!" });
    }
    if (password.length < 8) {
      return res
        .status(400)
        .json({ message: "Passwords must be at least 8 characters!" });
    }
    const existingEmail = pool.query("SELECT id FROM users WHERE email=$1", [
      cleanEmail,
    ]);

    if (existingEmail.rows.length > 0) {
      return res.status(409).json({ message: "Email already registered" });
    }
    const hashPassword = await bcrypt.hash(password, 12);

    const result = pool.query(
      "INSERT INTO users (name,email,password,role) VALUES($1,$2,$3,$4) RETURNING *",
      [cleanName, cleanEmail, hashPassword, role || "user"],
    );
    res
      .status(201)
      .json({ message: "User registered successfully", user: result.rows[0] });
  } catch (error) {
    if (error.code === "23505") {
      return res.status(409).json({
        message: "Email already registered",
      });
    }

    console.error("Registration error:", error.message);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
module.exports = { register };
