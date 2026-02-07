import express from "express";
import path from "path";
import { ENV } from "./config/env.js"

const app = express();

const __dirname = path.resolve();

app.get("/api/calling", (req,res) =>{
    res.status(200).json({message: "succes"})// donc le statut 200 veux dire succes et 500 echec ?
})

// make app ready for prod
if(ENV.NODE_ENV === "production"){
    app.use(express.static(path.join(__dirname, "../admin/dist")))

    app.get("/{*any}", (req,res) => {
        res.sendFile(path.join(__dirname, "../admin", "dist", "index.html"))
    })
}

app.listen(ENV.PORT, () => console.log(ENV.NODE_ENV+ENV.PORT+"Le serveur roule ma boule !"));
