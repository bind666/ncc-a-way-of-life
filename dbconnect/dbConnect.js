import mongoose from "mongoose";
import config from "../config/config.js";

async function dbConnect() {
    try {

        mongoose.connection.on("connected", () => {
            console.log("database connected successfully", mongoose.connection.host);
        })

        mongoose.connection.on("disconnect", () => {
            console.log("database disconnected", mongoose.connection.host);
        })

        mongoose.connection.on("error", () => {
            console.log("errror while connecting database", mongoose.connection.host);
        })

        await mongoose.connect(config.DB_URI)
    } catch (error) {
        console.log(`databse connection error`, error);
    }
}

export default dbConnect;