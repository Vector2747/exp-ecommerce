import express from "express";

const app = express();

app.get("/api/calling", (req,res) =>{
    res.status(200).json({message: "succes"})// donc le statut 200 veux dire succes et 500 echec ?
})

app.listen(3000, () => console.log("Le serveur roule ma boule !"));
