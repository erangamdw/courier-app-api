import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { databaseSetup } from "./startup/dbConnection";

dotenv.config();

const app = express();
const port = process.env.PORT || 8060;

app.use(cors());
app.use(express.json());

app.use(
  cors({
    optionsSuccessStatus: 200,
    origin: "*",
    allowedHeaders: [
      "Content-Type, Access-Control-Allow-Headers, Access-Control-Allow-Origin, Authorization, X-Requested-With",
      "Cache-Control",
    ],
  })
);

databaseSetup()
  .then(() => {
    try {
      app.listen(port, () => {
        console.log("listening on port", port);
      });
    } catch {
      console.log("Cannot Connect to the server");
    }
  })
  .catch((error) => {
    console.log("Invalid database connections", error);
  });
