// NPM
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const PORT = process.env.PORT || 5000;
const multer = require("multer");
const path = require("path");

dotenv.config();

app.use("/images", express.static(path.join(__dirname, "public/images")));

// MIDDLEWARE
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/images");
    },
    filename: (req, file, cb) => {
        console.log(JSON.parse(JSON.stringify(req.body)));

        cb(null, file.originalname);
    },
});

const upload = multer({ storage });
app.post("/api/upload", upload.single("file"), (req, res) => {
    try {
        return res.status(200).json({ msg: "File uploaded successfully" });
    } catch (error) {
        console.log(error);
    }
});

// Route
app.get("/", (req, res) => {
    res.json({ msg: "welcome to page" });
});

app.use("/api/auth", require("./routes/auth"));
app.use("/api/users", require("./routes/users"));
app.use("/api/posts", require("./routes/posts"));
app.use("/api/conversations", require("./routes/conversations"));
app.use("/api/messages", require("./routes/messages"));

// CONNECT DB
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(`Mongodb connected`);
    } catch (error) {
        console.log(error.message);
    }
};
connectDB();
app.listen(PORT, () => {
    console.log("Backend server is running!", PORT);
});
