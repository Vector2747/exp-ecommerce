import { requireAuth } from "@clerk/express";
import { User } from "../models/user.model.js";
import { ENV } from "../config/env.js";

export const protectRoute = [
    requireAuth(),
    async (req,res,next) =>{
        try {
            const clerkId = req.auth().userId
            if(!clerkId) return res.status(401).json({ message : "Unauthorised -- invalid token"})

            const user = await User.findOne({clerkId : clerkId})
            if(!user) return res.status(404).json({ message : "User not found"})

            req.user = user;
            next();
        } catch (error){
            console.error("erreur dans le dingleware de protection de route", error)
            res.status(500).json({ message : "Erreur interne du serveur"})
        }
    },
];

export const adminOnly = (req,res,next) => {
    if (!req.user){
        return res.status(401).json({ message : "Non-autorise -- user not found in request"})
    }

    if(req.user.email !==ENV.ADMIN_EMAIL){
        return res.status(403).json({ message : "Interdit -- accès réservé aux administrateurs"})
    }

    next();
}