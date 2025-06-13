const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../db");

exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  const hash = await bcrypt.hash(password, 10);
  await pool.query("INSERT INTO users(name, email, password) VALUES($1, $2, $3)", [name, email, hash]);
  res.json({ message: "User created" });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = (await pool.query("SELECT * FROM users WHERE email = $1", [email])).rows[0];
  if (!user || !(await bcrypt.compare(password, user.password))) return res.status(401).json({ error: "Invalid" });

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);
  res.json({ token });
};
