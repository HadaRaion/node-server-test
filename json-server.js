const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const port = 3001;

app.use(express.json());

app.post("/upload", (req, res) => {
  console.log("Received a request at /upload");
  console.log(req.body);
  const { file } = req.body;

  if (!file) {
    return res.status(400).send("Filename and content are required.");
  }

  const base64Data = file.split(";base64,").pop();
  const filePath = path.join(__dirname, "uploads", "test2.xls");

  fs.writeFile(filePath, base64Data, { encoding: "base64" }, (err) => {
    if (err) {
      console.error("File saving error:", err);
      return res.status(500).send("Error saving the file.");
    }
    res.send("File uploaded successfully.");
  });
});

app.use((err, req, res, next) => {
  console.error("Unexpected error:", err);
  console.error(err.stack);
  res.status(500).send("An unexpected error occurred.");
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
