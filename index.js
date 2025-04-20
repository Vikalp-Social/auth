import "dotenv/config";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import statusMonitor from "express-status-monitor";
import cookieParser from "cookie-parser";

import authRouter from "./routers/auth.js";
import healthRouter from "./routers/health.js";
import registerRouter from "./routers/register.js";
import metricRouter from "./routers/metric.js"
import listsRouter from "./routers/lists.js"

import serverlessExpress from "aws-serverless-express";


const app = express();
const port = process.env.PORT || 4000
const ref = new Date(1/1/1970);
// export const domain = process.env.DOMAIN_STAGE;
export const domain = 'http://localhost:3001';
const algo = "hot";

//middlewares
app.use(statusMonitor());
app.use(cookieParser());
app.use(cors({ origin: domain, credentials: true }));
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
