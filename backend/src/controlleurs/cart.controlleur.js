import { Cart } from "../models/cart.model.js";
import { Product } from "../models/product.model.js";

export async function getCart (req,res){
    try {
        let cart = await Cart.findOne({ clerkId : req.user.clerkId}).populate("items.product");

        if(!cart){
            const user = req.user;
            cart = await Cart.create({
                user : user._id,
                clerkId : user.clerkId,
                items : [],

            });
        }

        res.status(200).json({ cart });
    } catch (error) {
        console.error("Erreur lors de la recuperation du panier", error)
        res.status(500).json({ message : "Erreur interne du serveur"})
    }
}

export async function addToCart (req,res){
    try {
        const { productId, quantity = 1 } = req.body;

        // verification de l'existance du rpoduit
        const product = await Product.findById(productId);

        if(!product){
            return res.status(404).json({ message : "Produit non trouvé"});
        }

        if(product.stock < quantity){
            return res.status(400).json({ message : "Stock insuffisant pour ce produit"});
        }

        let cart = await Cart.findOne({ clerkId : req.user.clerkId});

        if(!cart){
            const user = req.user;
            cart = await Cart.create({
                user : user._id,
                clerkId : user.clerkId,
                items : [],

            });
        }

        const existingItem = cart.item.find((item) => { item.product.toString() === productId});
        if(existingItem){
            // incrementation de la quantite
            const newQuantite = existingItem.quantity + 1;
            if(product.stock < newQuantite){
                return res.status(400).json({ message : "Stock insuffisant pour ce produit"});
            }
            existingItem.quantity = newQuantite;
        }else{
            cart.items.push({ product : productId, quantity});
        }

        await cart.save();
        res.status(200).json({ message : "Produit ajoute au panier avec succes", cart})
    } catch (error) {
        console.error("Erreur lors de l'ajout au panier", error)
        res.status(500).json({ message : "Erreur interne du serveur"})
    }
}

export async function updateCartItem (req,res){
    try {
        const { productId } = req.params;
        const { quantity } = req.body;

        if(quantity < 1){
            return res.status(400).json({ message : "La quantite doit etre au moins 1"})
        }

        const cart = await Cart.findOne({ clerkId : req.user.clerkId});
        if(!cart){
            return res.status(404).json({ message : "Panier non trouve"})
        }

        const itemIndex = cart.items.findIndex((item) => item.product.toString() === productId);
        if(itemIndex === -1){
            return res.status(404).json({ message : "Produit non trouve dans le panier"})
        }

        // verification de l'existance du produit & valider le stock
        const product = await Product.findById(productId);
        if(!product){
            return res.status(404).json({ message : "Produit non trouve"})
        }

        if(product.stock < quantity){
            return res.status(400).json({ message : "Stock insuffisant pour ce produit"});
        }

        cart.items[itemIndex].quantity = quantity;
        await cart.save();
        res.status(200).json({ message : "quantite du produit M.A.J avec succes", cart})
    } catch (error) {
        console.error("Erreur lors de la M.A.J du panier", error)
        res.status(500).json({ message : "Erreur interne du serveur"})
    }
}

export async function removeFromCart (req,res){
    try {
        const { productId } = req.params;
        const cart = await Cart.findOne({ clerkId : req.user.clerkId});
        if(!cart){
            return res.status(404).json({ message : "Panier non trouve"});
        }

        cart.items = cart.items.filter((item) => item.product.toString() !== productId);
        await cart.save();
        res.status(200).json({ message : "Produit retire du panier avec succes", cart});
    } catch (error) {
        console.error("Erreur lors de la suppression d'un produit du panier", error)
        res.status(500).json({ message : "Erreur interne du serveur"})
    }
}

export async function clearCart (req,res){
    try {
        const cart = await Cart.findOne({ clerkId : req.user.clerkId});
        if(!cart){
            return res.status(404).json({ message : "Panier non trouve"});
        }

        cart.items = [];

        await cart.save();
        res.status(200).json({ message : "Panier vide avec succes", cart});
    } catch (error) {
        console.error("Erreur lors de la suppression du contenu du panier", error)
        res.status(500).json({ message : "Erreur interne du serveur"})
    }
}

