const express = require("express");
const routes = require("./routes/routes");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 80;

app.use(cors());

const connectToMongoDB = require("./db");
const errorHandle = require("./middleware/errorHandler");

app.use(express.json());

app.use(errorHandle);

app.use(
  cors({
    origin: "*",
    "Access-Control-Allow-Origin": "*",
  })
);

app.use("/api/", routes);

connectToMongoDB();

app.listen(PORT, () => {
  console.log(`server running at ${PORT}`);
});
