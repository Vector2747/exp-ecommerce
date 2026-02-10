import { Product } from "../models/product.model.js";
import { Order } from "../models/order.model.js";
import { Review } from "../models/review.model.js";

export async function createOrder (req,res){
    try {
        const user = req.user;
        const { orderItems, shippingAddress, paymentResult, totalPrice } = req.body;

        if(!orderItems || orderItems.length === 0){
            return res.status(400).json({ message : "La commande n'a pas de produits"});
        }

        for(const item of orderItems){
            const product = await Product.findById(item.product._id);

            if(!product){
                return res.status(404).json({ message : "Produit non trouve : " + item.name})
            }

            if(product.stock < item.quantity){
                return res.status(400).json({ message : "Stock insuffisant pour le produit :" + item.name});
            }
        }

        const order = await Order.create({
            user : user._id,
            clerkId : user.clerkId,
            orderItems : orderItems,
            shippingAddress : shippingAddress,
            paymentResult : paymentResult,
            totalPrice : totalPrice
        })

        // metre le stock a jours
        for(const item of orderItems){
            await Product.findByIdAndUpdate(item.product._id, {
                $inc : { stock : -item.quantity},
            })
        }

        res.status(201).json({ message : "Commande cree avec succes", order});
    } catch (error) {
        console.error("Erreur lors de la creation de la commande", error)
        res.status(500).json({ message : "Erreur interne du serveur"})
    }
}

export async function getOrders (req,res){
    try {
        const order = await Order.find({ clerkId : req.user.clerkId}).populate("orderItems.product").sort({ createdAt : -1});

        // verifier si la commande a ete commente
        const orderWithComments = await Promise.all(
            order.map(async (order) => {
                const review = await Review.findOne({ orderId : order._id});
                return {
                    ...order.toObject(),
                    hasReviewed : !!review,
                };
            })
        );

        res.status(200).json({ message : "Commandes recuperes avec succes", orders: orderWithComments})
    } catch (error) {
        console.error("Erreur lors de la recuperation de la commande", error)
        res.status(500).json({ message : "Erreur interne du serveur"})
    }
}