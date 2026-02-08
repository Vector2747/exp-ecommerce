import mongoose from "mongoose";
import { ENV } from "./env.js";

export const  connectDB = async () => {
    try{
        const conn = await mongoose.connect(ENV.DB_URL)
        console.log(`connectes a la basse de donnes: ${conn.connection.host}`)
    }catch(error){
    console.error("erreur de connection a la basse de donnes")
    process.exit(1)
    }
}
