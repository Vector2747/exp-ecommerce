import { Inngest } from "inngest";
import { connectDB } from "./db.js";
import { User } from "../models/user.model.js";

export const ingest = new Inngest({ id : "AnyBuy"})

const syncUser = ingest.createFunction(
    { id : "sync-user"},
    {event : "clerck/user.created"},
    async ({ event }) => {
        await connectDB();
        const { id, email_adresses, first_name, last_name, image_url } = event.data;
        const newUser = {
            clerkId : id,
            email : email_adresses[0]?.email_adress,
            name : `${first_name || ""} ${last_name || ""}` || "User",
            imageURL : image_url || "",
            adresses : [],
            wishlist : [],
        }
        await User.create(newUser);
    }
)

const deleteUserFromDB = ingest.createFunction(
    { id : "delete-user-from-db"},
    { event : "clerck/user.deleted"},
    async ({ event }) => {
        await connectDB();
        
        const { id } = event.data;
        await User.findOneAndDelete({ clerkId : id });
    }
)


export const functions = [syncUser, deleteUserFromDB]