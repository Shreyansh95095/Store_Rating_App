const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const DB = require("../db/db");


// User register function (supports role: Admin/Normal User/Owner)
async function registerUser(req, res) {
  const { fullName, email, password, address, role } = req.body;

  try {
    const [isUserExist] = await DB.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (isUserExist.length > 0) {
      return res.status(400).json({ message: "User Already Exist" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const userRole = role && ["Admin", "Normal User", "Owner"].includes(role) ? role : "Normal User";

    const [result] = await DB.query(
      "INSERT INTO users (fullName, email, password, address, role) VALUES (?, ?, ?, ?, ?)",
      [fullName, email, hashedPassword, address, userRole]
    );

    const userId = result.insertId;

    const token = jwt.sign({ id: userId }, process.env.JWT_SECRET);
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    });

    res.status(201).json({
      message: "User Registered Successfully",
      user: { id: userId, email, fullName, address, role: userRole },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

//User login function (role-aware: Admin / Normal User / Owner)
async function loginUser(req, res) {
  try {
    const { email, password, role } = req.body;

    // Map role variants to DB values if provided
    let roleFilter = null;
    if (role) {
      const lower = String(role).toLowerCase();
      if (lower === 'admin') roleFilter = 'Admin';
      else if (lower === 'owner') roleFilter = 'Owner';
      else if (lower === 'user' || lower === 'normal user') roleFilter = 'Normal User';
      else return res.status(400).json({ message: 'Invalid role' });
    }

    let query = "SELECT * FROM users WHERE email = ?";
    const params = [email];
    if (roleFilter) {
      query += " AND LOWER(role) = LOWER(?)";
      params.push(roleFilter);
    }

    const [user] = await DB.query(query, params);
    if (user.length === 0) {
      return res.status(400).json({ message: "User Not Found" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user[0].password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid Password" });
    }

    const token = jwt.sign({ id: user[0].id }, process.env.JWT_SECRET);
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    });

    res.status(200).json({
      message: "User Logged In Successfully",
      user: {
        id: user[0].id,
        email: user[0].email,
        fullName: user[0].fullName || user[0].name,
        address: user[0].address,
        role: user[0].role || roleFilter || null,
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

//User logout function

function logoutUser(req, res) {
  res.clearCookie("token");
  res.status(200).json({
    message: "User Logged Out Successfully"
  });
}


// Return current session user using JWT cookie
async function me(req, res) {
  try {
    const token = req.cookies?.token;
    if (!token) return res.status(401).json({ message: "Unauthorized" });
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const [rows] = await DB.query("SELECT id, email, fullName, address, role FROM users WHERE id = ?", [payload.id]);
    if (!rows?.length) return res.status(401).json({ message: "Unauthorized" });
    return res.json({ user: rows[0] });
  } catch (e) {
    return res.status(401).json({ message: "Unauthorized" });
  }
}


module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  me,
};
