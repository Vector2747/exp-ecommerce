import { Order } from "../models/order.model.js";
import { Review } from "../models/review.model.js";
import { Product } from "../models/product.model.js";

export async function createReview(req,res){
    try {
        const user = req.user;
        const { productId, orderId, rating } =req.body;

        if(!rating || rating<1 || rating >5){
            return res.status(400).json({ message : "Rating doit etre entre 1 et 5"});
        }

        const order = await Order.findById(orderId);
        if(!order){
            return res.status(404).json({ message : "Commande non trouvee donc pas possible de laisser une review"})
        }

        if(order.clerkId !== user.clerkId){
            return res.status(403).json({ message : "Vous n'avez pas le droit de review une commande qui n'est pas la votre"});
        }

        if(order.status !== "delivered"){
            return res.status(400).json({ message : "Vous ne pouvez pas laisser une review pour une commande qui n'est pas encore livree"})
        }

        const productInOrder = order.orderItems.find((item) => item.product.toString() === productId.toString());

        if(!productInOrder){
            return res.status(400).json({ message : "le produit n'est meme pas dans la commande"});
        }

        if(!productId || !orderId){
            return res.status(400).json({ message : "productId et orderId sont requis"});
        }

        const review = await Review.create({
            productId,
            userId : user._id,
            orderId,
            rating
        });

        // mettre a jour la note du produit
        const reviews = await Review.find({ productId });
        const totalRating = reviews.reduce((sum, rev) => sum + rev.rating, 0);
        const updatedProduct = await Product.findByIdAndUpdate(productId, {
            averageRating : totalRating / reviews.length,
            totalReveiws : reviews.length,
        },{
            new : true,
            runValidators : true
        })
        
        if(!updatedProduct){
            await Review.findByIdAndDelete(review._id);
            return res.status(404).json({ message : "Produit non trouve, review annulee"})
        }

        res.status(201).json({ message : "Review cree avec succes", review})
    } catch (error) {
        console.error("Erreur lors de la creation de la review", error);
        res.status(500).json({ message : "Erreur interne du serveur"});
    }
}

export async function deleteReview(req,res){
    try {
        const { reviewId } =req.params;
        const user = req.user;

        const review = await Review.findById(reviewId);
        if(!review){
            return res.status(404).json({ message : "Review non trouvee"})
        }

        if(review.userId.toString() !== user._id.toString()){
            return res.status(403).json({ message : "Vous n'avez pas le droit de supprimer une review qui n'est pas la votre"});
        }

        const productId = review.productId;
        await review.findByIdAndDelete(reviewId);

        // mettre a jour la note du produit
        const product = await Product.findById(productId);
        const reviews = await Review.find({ productId });
        const totalReview = reviews.reduce((sum, rev) => sum + rev.rating, 0);
        product.averageRating = reviews.length > 0 ? totalReview / reviews.length : 0;
        product.totalReveiws = reviews.length;
        await product.save();
        res.status(200).json({ message : "Review supprimee avec succes"})
    } catch (error) {
        console.error("Erreur lors de la suppression de la review", error);
        res.status(500).json({ message : "Erreur interne du serveur"});
    }
}