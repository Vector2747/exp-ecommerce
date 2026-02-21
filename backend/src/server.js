import express from "express";
import path from "path";
import { ENV } from "./config/env.js"
import { connectDB } from "./config/db.js";
import { clerkMiddleware } from '@clerk/express'
import cors from "cors";

import { serve } from "inngest/express"
import { functions, ingest} from "./config/ingest.js";

import adminRoutes from "./routes/admin.route.js";
import userRoutes from "./routes/user.route.js";
import orderRoutes from "./routes/order.route.js";
import reviewRoutes from "./routes/review.route.js";
import productRoutes from "./routes/product.route.js";
import cartRoutes from "./routes/cart.route.js";

const app = express();

const __dirname = path.resolve();

app.use(express.json());
app.use(clerkMiddleware());//  clerkMiddleware() est un middleware qui permet de vérifier si l'utilisateur est connecté ou pas. Si l'utilisateur est connecté, il ajoute les informations de l'utilisateur dans la requête (req.user) et passe à la suite. Si l'utilisateur n'est pas connecté, il renvoie une erreur 401 (Unauthorized).

// credentials : true permet d'autoriser les cookies et les en-tetes d'authentification dans les requetes cross-origin. cela est necessaire pour que le client puisse envoyer les cookies de session ou les jetons d'authentification avec les requetes vers l'api.sans ca le client ne pourra pas s'authentifier et acceder aux ressources proteges de l'api
app.use(cors({origin : ENV.CLIENT_URL, credentials : true}))// cors() est un midleware qui perment de generer une erreur cors si le client n'est pas autorise a acceder a l'api. il prend en parametre un objet de configuration qui contien la propriete origine qui est l'url du client autorise a acceder a l'api

app.use("/api/ingest", serve({client:ingest, functions:functions}))//  serve() est une fonction qui permet de créer une route pour les fonctions Inngest. Elle prend en paramètre l'instance Inngest et un tableau de fonctions. Elle crée une route /api/ingest qui écoute les événements et exécute les fonctions correspondantes.

app.use("/api/admin", adminRoutes)
app.use("/api/users", userRoutes)
app.use("/api/orders", orderRoutes)
app.use("/api/reviews", reviewRoutes)
app.use("/api/products", productRoutes)
app.use("/api/cart", cartRoutes)
//app.use("/api/payement", )

app.get("/api/calling", (req,res) =>{
    res.status(200).json({message: "succes"})// donc le statut 200 veux dire succes et 500 echec ?
})

// make app ready for prod
/*if(ENV.NODE_ENV === "production"){
    app.use(express.static(path.join(__dirname, "../admin/dist")))

    app.get("/{*any}", (req,res) => {
        res.sendFile(path.join(__dirname, "../admin", "dist", "index.html"))
    })
}*/
/*if(ENV.NODE_ENV === "production"){
    // Static files
    app.use(express.static(path.join(__dirname, "../../admin/dist")));

    // SPA fallback
    app.get("/*", (req,res) => {
        res.sendFile(path.join(__dirname, "../../admin/dist/index.html"));
    });
}*/
/*if (ENV.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../public")));

    app.get("/{*any}", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/index.html"));
});
}*/

if (ENV.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/public")));

  app.get("/{*any}", (req, res) => {
    res.sendFile(path.join(__dirname, "backend/public/index.html"));
  });
}

app.listen(ENV.PORT, () => {
    console.log(ENV.NODE_ENV+ENV.PORT+"Le serveur roule ma boule !")
    connectDB();
});
