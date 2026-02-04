import express from "express";
import multer from "multer";
import { exec } from "child_process";
import fs from "fs";

const app = express();
const upload = multer({ dest: "uploads/" });

app.get("/", (_, res) => {
  res.send("🚀 Plate OCR API online");
});

app.post("/read-plate", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "Envie uma imagem no campo 'image'" });
  }

  const filePath = req.file.path;

  exec(`tesseract ${filePath} stdout -l eng`, (err, stdout) => {
    fs.unlinkSync(filePath);

    if (err) {
      return res.status(500).json({ error: err.message });
    }

    const plate = stdout.replace(/\n/g, "").trim();

    res.json({ plate });
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Servidor rodando na porta", PORT));
