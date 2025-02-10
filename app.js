import express from "express";
import dbConnect from "./dbconnect/dbConnect.js";
import config from "./config/config.js";
import errorHandler from "./middleware/errorHandler.js";
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.route.js";
import cadetRouter from "./routes/cadet.route.js";
import eventRouter from "./routes/event.route.js";
import attendenceRouter from "./routes/attendence.route.js";
import Reportrouter from "./routes/report.route.js";

const app = express()

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


app.use("/api/v1/user", userRouter)
app.use("/api/v1/cadet", cadetRouter)
app.use("/api/v1/event", eventRouter)
app.use("/api/v1/attendence", attendenceRouter)
app.use("/api/v1/report", Reportrouter)


// @Global Middleware
app.use(errorHandler)


dbConnect().then(() => {
    const PORT = config.PORT
    app.listen(PORT, () => {
        console.log(`server is running at port`, PORT);
    })
}).catch((error) => {
    console.log(`db error!`, error);
    process.exit(1)
})
