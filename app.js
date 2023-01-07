import express from "express";
import { config } from "dotenv";
import ErrorMiddleware from "./middlewares/Error.js";

config({
    path: "./config/config.env"
});
const app = express();

// Using middlewares
app.use(express.json());
app.use(express.urlencoded({extended: true}));

export default app;