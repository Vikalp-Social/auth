import express from "express";
import axios from "axios";
import cors from "cors";
import bodyParser from "body-parser";
import statusMonitor from "express-status-monitor";

import authRouter from "./routers/auth.js";
import healthRouter from "./routers/health.js";
import registerRouter from "./routers/register.js";
import metricRouter from "./routers/metric.js"


export const domain = "http://localhost:3001";

const ref = new Date(1/1/1970);

const app = express();

//middlewares
app.use(statusMonitor());
app.use(cors());
app.use(bodyParser.json());

/*override endpoints below here*/

/*and above here */

//routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/health", healthRouter);
app.use("/api/v1/register", registerRouter);
app.use("/api/v1/metric", metricRouter);

const port = 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});