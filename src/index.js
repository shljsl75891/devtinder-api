import express from "express";
import connectDB from "./config/database.js";
import "./config/environment.js";

const app = express();
const PORT = +(process.env.PORT ?? 3400);

connectDB()
  .then(() => {
    console.info("Database connection established");
    app.listen(PORT, () => {
      console.info(`The server is running on: ${PORT}`);
    });
  })
  .catch((err) => {
    console.error(`Database connection failed: ${err}`);
  });
