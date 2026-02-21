import bcrypt from "bcrypt";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import fetch from "node-fetch";
import session from "express-session";
import MongoStore from "connect-mongo";
dotenv.config();

const app = express();
app.set("trust proxy", 1);
app.use(
  cors({
    origin: ["http://localhost:5173", "https://restro-data-xkg3.vercel.app"],
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.options("*", cors());

let URL = process.env.DB;

main()
  .then(() => console.log("Mongo connected"))
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(URL);
}

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
});

const User = mongoose.model("User", userSchema);

app.use(
  session({
    name: "SessionCookie",
    secret: "project_session_secret_2026_random_string",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.DB,
      collectionName: "sessions",
    }),
    cookie: {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24,
    },
  }),
);

app.get("/", (req, res) => {
  res.json({ message: "Ok" });
});

app.get("/test", (req, res) => {
  res.json({ message: "Working" });
});

app.get("/session", (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ loggedIn: false });
  }

  res.json({
    loggedIn: true,
    user: req.session.user,
  });
});

app.post("/signup", async (req, res) => {
  if (!req.body) {
    return res.status(400).json({ error: "No body received" });
  }

  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        errors: {
          error: "Required fields missing",
        },
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        errors: {
          error: "Invalid Email Format",
        },
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        errors: {
          error: "Email already exist",
        },
      });
    }

    if (password.length < 4) {
      return res.status(400).json({
        errors: {
          error: "Password must be atleast 4 characters",
        },
      });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashPassword,
    });

    req.session.user = {
      id: newUser._id,
      name: newUser.name,
    };

    return res.status(201).json({ message: "OK" });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        errors: {
          error: "Required fields missing",
        },
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        error: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    req.session.user = {
      id: user._id,
      name: user.name,
    };

    return res.status(200).json({
      message: "Login successful",
      userId: user._id,
      userName: user.name,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: "Server error",
    });
  }
});

app.post("/logout", (req, res) => {
  req.session.destroy(() => {
    res.clearCookie("SessionCookie");
    res.json({ message: "Logged out" });
  });
});

app.get("/api/restro", async (req, res) => {
  const { lat, lng } = req.query;

  if (!lat || !lng) {
    return res.status(400).json({ error: "lat and lng required" });
  }

  try {
    const response = await fetch(
      `https://www.swiggy.com/dapi/restaurants/list/v5?lat=${lat}&lng=${lng}`,
      {
        headers: {
          "User-Agent": "Mozilla/5.0",
          Accept: "application/json",
          Referer: "https://www.swiggy.com",
          Origin: "https://www.swiggy.com",
        },
      },
    );

    console.log("Swiggy status:", response.status);

    if (!response.ok) {
      return res.status(response.status).json({ error: "Blocked by Swiggy" });
    }

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Backend listening on", PORT));
