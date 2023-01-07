import express from "express";
import { config } from "dotenv";
import ErrorMiddleware from "./middlewares/Error.js";

config({
  path: "./config/config.env",
});
const app = express();

// Using middlewares
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

// adding routes
import user from "./routes/userRoutes.js";
import post from "./routes/postRoutes.js";

app.use("/api", user);
app.use("/api", post);

export default app;
