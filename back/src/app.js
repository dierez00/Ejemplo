import bodyParser from "body-parser";
import express from "express";
import userRoutes from "./routes/userRoutes.js";
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(bodyParser.json());
app.use("/app/users", userRoutes);

export default app;