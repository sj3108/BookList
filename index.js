const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const bodyParser = require("body-parser");
const colors = require("colors");

const dotenv = require("dotenv");
const connectDB = require("./config/db");
const handleError = require("./utlis/errorresponse");

const bookRoute = require("./routes/bookRoute");
const authRoute = require("./routes/authRoutes");

const path = require("path");
dotenv.config();

connectDB();

//rest object
const app = express();

//middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan("dev"));
app.use("/api/book", bookRoute);
app.use("/api/auth", authRoute);

// ----------deployment----------------
__dirname = path.resolve();
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/client/build")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "./client/src/index.js"));
  });
} else {
  app.get("/", (req, res) => {
    res.send("API is running..");
  });
}

app.use(handleError);

const PORT = process.env.PORT || 8100;

app.listen(PORT, () => {
  console.log(
    `Server Running in ${process.env.DEV_MODE} mode on port no ${PORT}`.bgCyan
      .white
  );
});
