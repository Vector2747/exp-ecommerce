import cloudinary from "../config/cloudinary.js";
import { Product } from "../models/product.model.js";
import { Order } from "../models/order.model.js";
import { User } from "../models/user.model.js";

export async function createProduct(req,res){
    try {
        const { name ,description ,price ,stock ,category } = req.body;
        if(!name || !description || !price || !stock || !category ){
            return res.status(400).json({ message : "Tous les champs sont requis"});
        }

        if(!req.files || req.files.length === 0){
            return res.status(400).json({ message : "Au moins une image est requise"});
        }

        if(req.files.length > 3){
            return res.status(400).json({ message : "3 images au maximum sont autorisees"})
        }

        const uploadPromises = req.files.map((file) => {
            return cloudinary.uploader.upload(file.path, {
                folder : "products"
            })
        })

        const uploadResults = await Promise.all(uploadPromises);

        // un truc pour que ca passe est la securite de l'url
        const imageURLs = uploadResults.map((result) => result.secure_url);

        const product = await Product.create({
            name,
            description,
            price : parseFloat(price),
            stock : parseInt(stock),
            category,
            image : imageURLs,
        });

        res.status(201).json({ message : "Produit cree avec succes", product});
    } catch (error) {
        console.error("Erreur lors de la creation d'un produit");
        res.status(500).json({ message : "Erreur interne du serveur"});
    }
}

export async function getAllProducts(_,res){
    try {
        const products = await Product.find().sort({createdAt: -1});  // -1 est le parametre pour la descendante
        res.status(200).json(products);
    } catch (error) {
        console.error("Erreur lors de la recherche d'un produit");
        res.status(500).json({ message : "Erreur interne du serveur"});
    }
}

export async function updateProduct(req,res){
    try {
        const { id } = req.params;
        const { name ,description ,price ,stock ,category } = req.body;

        const product = await Product.findById(id);
        if(!product){
            return res.status(404).json({ message : "Erreur : pas trouve de produits avec l'id donnes en parametres de la requete"})
        }

        if(name) product.name = name;
        if(description) product.description = description;
        if(price) product.price = parseFloat(price);
        if(stock !==undefined) product.stock = parseInt(stock);
        if(category) product.category = category;

        // ce bout de code est pour les images, si l'utilisateur envoie des nouvelles images, on les upload et on remplace les anciennes
        if(req.files && req.files.length > 0){
            if(req.files.length > 3) {
                return res.status(400).json({ message : "3 images au maximum sont autorisees"})
            }

            const uploadPromises = req.files.map((file) => {
                return cloudinary.uploader.upload(file.path, {
                    folder : "products",
                });
            });

            const uploadResults = await Promise.all(uploadPromises);
            product.images = uploadResults.map((result) => result.secure_url);
        }

        await product.save();
        res.status(200).json({ message : "Modification d'un produit avec succes", product})
    } catch (error) {
        console.error("Erreur lors de la modification d'un produit")
        res.status(500).json({ message : "Erreur interne du serveur"})
    }
}

export async function getAllOrders(_,res){
    try {
        const orders = await Order.find().populate("user", "name email").populate("orderItems.product").sort({createdAt: -1})

        res.status(200).json({ orders })
    } catch (error) {
        console.error("Erreur lors de la recuperation des commandes", error)
        res.status(500).json({ message : "Erreur interne du serveur"})
    }
}

export async function updateOrderStatus(req,res){
    try {
        const { orderId } = req.params;
        const { status } = req.body;

        if(!["pending", "shipped", "delivered"].includes(status)){
            return res.status(400).json({ message : "Status invalide. Les status valides sont : pending, shipped, delivered"})
        }

        const order = await Order.findById(orderId);
        if(!order){
            return res.status(404).json({ message: "Commande non trouvee"})
        }

        order.status = status;
        if(status === "shipped" && !order.shippedAt){
            order.shippedAt = new Date();
        }
        if(status === "delivered" && !order.deliveredAt){
            order.deliveredAt = new Date();
        }
        await order.save();
        res.status(200).json({ message : "Statut de la commande modifies avec succes", order})
    } catch (error) {
        console.error("Erreur lors de la modification d'une' commande", error)
        res.status(500).json({ message : "Erreur interne du serveur"})
    }
}

export async function getAllClients(_,res){
    try {
        const clients = await User.find().sort({createdAt : -1});
        res.status(200).json({ clients})
    } catch (error) {
        console.error("Erreur lors de la recuperation des clients", error);
        res.status(500).json({ message : "Erreur interne du serveur"});
    }
}

export async function getDashboardStatus(_,res){
    try {
        const totalOrders = await Order.countDocuments();
        const totalResultat = await Order.aggregate([
            {
                $group : {
                    _id : null,
                    totalReveStututututu : { $sum : "$totalPrice"}
                },
            },
        ])

        const totalRevenue = await totalResultat[0]?.totalReveStututututu || 0;
        const totalClients = await User.countDocuments();
        const totalProducts = await Product.countDocuments();

        res.status(200).json({
            totalOrders,
            totalRevenue,
            totalClients,
            totalProducts,
        })
    } catch (error) {
        console.error("Erreur lors de la recuperation du dashboard stgatut", error)
        res.status(500).json({ message : "Erreur interne du serveur"})
    }
}