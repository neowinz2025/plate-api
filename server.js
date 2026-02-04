
import express from "express";
import multer from "multer";
import { exec } from "child_process";
import fs from "fs";

const app = express();
const upload = multer({ dest: "uploads/" });

const API_KEY = "dfmilhas123";

app.use((req, res, next) => {
  if (req.path === "/") return next();

  const token = req.headers.authorization?.replace("Token ", "");
  if (!token || token !== API_KEY) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
});

app.get("/", (_, res) => {
  res.send("🚀 Plate Recognizer Style API running");
});

app.post("/v1/plate-reader", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "image file required" });
  }

  const file = req.file.path;

  exec(`python3 detect.py ${file}`, (err, stdout) => {
    fs.unlinkSync(file);
    if (err) return res.status(500).json({ error: err.message });
    res.json(JSON.parse(stdout));
  });
});

app.listen(process.env.PORT || 3000);
