import express, { Router } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { databaseSetup } from "./startup/dbConnection";
import bodyParser from "body-parser";
import * as routes from "../src/routes/";
import session from "express-session";
import { setupSession } from "./middleware/sesseionMiddleware";

dotenv.config();

const app = express();

const port = process.env.PORT || 8060;

app.use(cors());
app.use(express.json());
// app.use(bodyParser.({ extended: true }));

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

// app.use(
//   session({
//     secret: "fjhdgfjhdgf@2312334$#@$21ASsad",
//     resave: false,
//     saveUninitialized: true,
//     cookie: { secure: false },
//   })
// );
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

routes.initRoutes(app);

export default app;
