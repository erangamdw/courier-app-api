/// <reference path="global.d.ts" />
require('dotenv').config();

import express from "express";
import bodyParser from "body-parser";
import fs from 'fs';
import https from 'https';
import morgan from 'morgan';
import * as routes from './routes';
// import {urlencoded} from 'body-parser';
import {logRequest} from './middleware/request-logger';
import {handleError} from './middleware/error-handler';
import {Authentication} from './middleware/authentication';
import {AppLogger} from './common/logging';
import databaseSetup from "./startup/database";
import passportStartup from "./startup/passport";
import cors from 'cors';
import {verifyRole} from "./middleware/verify-role";
import {Role} from "./models/user-model";

const production = process.env.NODE_ENV === "production";
const PORT: any = process.env.PORT || 4000;

// noinspection JSIgnoredPromiseFromCall
databaseSetup();

const app = express();

app.use(logRequest);
app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));

// noinspection JSIgnoredPromiseFromCall
passportStartup(app);
app.use(morgan('combined'));

if (!production) {
    app.use(cors({
        optionsSuccessStatus: 200,
        origin: '*',
        allowedHeaders: ['Content-Type, Access-Control-Allow-Headers, Access-Control-Allow-Origin, Authorization, X-Requested-With', 'Cache-Control']
    }));
}

app.use('/api/auth', Authentication.verifyToken);
app.use('/api/admin', Authentication.verifyToken);
app.use('/api/admin', verifyRole(Role.SUPER_ADMIN, Role.ADMIN));

if (production) {
    https.createServer({
        key: fs.readFileSync(process.env.SERVER_KEY_PATH || 'server.key'),
        cert: fs.readFileSync(process.env.SERVER_CERT_PATH || 'server.cert')
    }, app).listen(PORT, () => {
        AppLogger.info('--> HTTPS Server successfully started at port :: ' + PORT);
    });
} else {
    app.listen(PORT, () => {
        AppLogger.info('--> Server successfully started at port :: ' + PORT);
    });
}
routes.initRoutes(app);
app.use(handleError);

export default app;
