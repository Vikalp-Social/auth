import express from "express";
import axios from "axios";
import cors from "cors";
import bodyParser from "body-parser";
import statusMonitor from "express-status-monitor";

import authRouter from "./routers/auth.js";
import healthRouter from "./routers/health.js";
import registerRouter from "./routers/register.js";
import metricRouter from "./routers/metric.js"

import serverlessExpress from "aws-serverless-express";


const app = express();
const port = process.env.PORT || 3000
const ref = new Date(1/1/1970);
export const domain = "https://srg.social";

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
app.use("/api/v1/lists", listsRouter);

const server = serverlessExpress.createServer(app);

export const handler = (event, context) => serverlessExpress.proxy(server, event, context)

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
