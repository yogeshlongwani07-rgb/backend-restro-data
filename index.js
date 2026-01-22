import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();

app.use(cors());

app.get("/api/restro", async (req, res) => {
  const { lat, lng } = req.query;

  try {
    const response = await fetch(
      `https://www.swiggy.com/dapi/restaurants/list/v5?lat=${lat}&lng=${lng}`,
      {
        headers: {
          "User-Agent": "Mozilla/5.0"
        }
      }
    );

    const data = await response.json();
    res.json(data);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Fetch failed" });
  }
});

app.listen(5000, () => {
  console.log("Backend running");
});
