const express = require("express");
const multer = require("multer");
const cors = require("cors");

const app = express();

const port = process.env.PORT || 3000;

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    const now = new Date();
    const datePrefix = `${now.getFullYear()}-${(now.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${now.getDate().toString().padStart(2, "0")}_${now
      .getHours()
      .toString()
      .padStart(2, "0")}-${now.getMinutes().toString().padStart(2, "0")}-${now
      .getSeconds()
      .toString()
      .padStart(2, "0")}`;

    cb(null, datePrefix + "_" + file.originalname);
  },
});

const upload = multer({ storage: storage });

const allowedOrigins = [
  "https://zondahome.com",
  "https://stg.zondahome.com",
  "https://dev.zondahome.com",
  "https://zondahomecom.local",
];

const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};

//
app.use(cors());

app.post("/upload", upload.single("file"), (req, res) => {
  console.log("Received a request at /upload");

  if (!req.file) {
    console.log(req);
    return res.status(400).send("No file uploaded.");
  }

  if (req.file) {
    console.log("File details:", req.file);
  }

  res.json({
    message: "File uploaded successfully.",
    file: {
      filename: req.file.filename,
      mimetype: req.file.mimetype,
      size: req.file.size,
    },
  });
});

app.use((err, req, res, next) => {
  console.error("An error occurred:", err);
  res.status(500).send("Something went wrong.");
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
