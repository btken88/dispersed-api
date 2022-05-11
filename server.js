const express = require("express");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cors = require("cors");
const connectDB = require("./config/db");
const app = express();
const PORT = process.env.PORT || 3000;

dotenv.config({ path: "./config/.env" });

const loginRouter = require("./routes/login");
const favoritesRouter = require("./routes/favorites");
const registerRouter = require("./routes/register");

connectDB();

app.use(bodyParser.json());
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms")
);

app.use("/login", loginRouter);
app.use("/favorites", favoritesRouter);
app.use("/register", registerRouter);

const server = app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

// Handle promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`);
  server.close(() => process.exit(1));
});
