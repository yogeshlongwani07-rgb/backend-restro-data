import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import fetch from "node-fetch";
dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.options("*", cors());

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

app.get("/", (req, res) => {
  res.json({ message: "Ok" });
});

app.get("/signup", (req, res) => {
  res.json({ message: "Working" });
});

app.post("/signup", async (req, res) => {
  if (!req.body) {
    return res.status(400).json({ error: "No body received" });
  }

  try {
    const { name, email, password } = req.body;
    console.log(name, email, password);

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

    if (password.length < 2) {
      return res.status(400).json({
        errors: {
          error: "Password must be atleast 2 characters",
        },
      });
    }

    await User.create({
      name,
      email,
      password,
    });

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

    if (user.password !== password) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    return res.status(200).json({
      message: "Login successful",
      userId: user._id,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: "Server error",
    });
  }
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
