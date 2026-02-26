import { User } from "../models/user.model.js";

export async function addAddress (req,res){
    try {
        const { label, fullName, streetAddress, city, state, ZIPcode, phoneNumber, isDefault } = req.body;

        if(!label || !fullName || !streetAddress || !city || !state || !ZIPcode || !phoneNumber){
            return res.status(400).json({ message : "Tous les champs sont obligatoires"})
        }
        const user = req.user;
        if(isDefault){
            user.addresses.forEach(addr => {
                addr.isDefault = false;
            });
        }

        user.addresses.push({
            label,
            fullName,
            streetAddress,
            city,
            state,
            ZIPcode,
            phoneNumber,
            isDefault : isDefault || false
        })

        await user.save();
        res.status(201).json({ message : "Addresse ajoutee avec succes", addresses : user.addresses})
    } catch (error) {
        console.error("Erreur lors de l'ajout d'une addresse", error);
        res.status(500).json({ message : "Erreur interne du serveur"});
    }
}

export async function getAddresses (req,res){
    try {
        const user = req.user


        await user.save();
        res.status(201).json({ addresses : user.addresses})
    } catch (error) {
        
    }
}

export async function updateAddress (req,res){
    try {
        const { label, fullName, streetAddress, city, state, ZIPcode, phoneNumber, isDefault } = req.body;
        const { adresseId } = req.params;
        const user = req.User;
        const address = user.addresses.id(adresseId);

        if(!address){
            return res.status(404).json({message: "Erreur addresse non trouvee"})
        }

        if(isDefault){
            user.addresses.forEach(addr => {
                addr.isDefault = false;
            });
        }

        address.label = label || address.label;
        address.fullName = fullName || address.fullName;
        address.streetAddress = streetAddress || address.streetAddress;
        address.city = city || address.city;
        address.state = state || address.state;
        address.ZIPcode = ZIPcode || address.ZIPcode;
        address.phoneNumber = phoneNumber || address.phoneNumber;
        address.isDefault = isDefault !== undefined ? isDefault : address.isDefault;

        await user.save();
        res.status(201).json({ message : "Addresse modifiee avec succes", addresses : user.addresses})
    } catch (error) {
        console.error("Erreur lors de la modification d'une addresse");
        res.status(500).json({ message : "Erreur interne du serveur"});
    }
}

export async function deleteAddress (req,res){
    try {
        const { addressId } = req.params;
        const user = req.user;

        user.addresses.pull(addressId);
        await user.save();
        res.status(200).json({ message : "Addresse supprimee avec succes", addresses : user.addresses})
    } catch (error) {
        console.error("Erreur lors de la suppression d'une addresse", error);
        res.status(500).json({ message : "Erreur interne du serveur"});
    }
}

export async function addToWishlist (req,res){
    try {
        const { productId } = req.body;
        const user = req.user;

        // Vérifier si le produit est déjà dans la wishlist
        if(user.wishlist.includes(productId)){
            return res.status(400).json({ message : "Produit deja dans la wishlist"})
        }

        user.wishlist.push(productId);
        await user.save();
        res.status(200).json({ message : "Produit ajoute a la wishlist avec succes", wishlist : user.wishlist})
    } catch (error) {
        console.error("Erreur lors de l'ajout d'un produit a la wishlist", error);
        res.status(500).json({ message : "Erreur interne du serveur"});
    }
}

export async function getWishlist (req,res){
    try {
        // on utilise "populte" car wishlist est un tableau d'id de produits, et on veux les infos du produit
        const user = await User.findById(req.user._id).populate("wishlist");
        console.log("GET WISHLIST CALLED");
        res.status(200).json({ wishlist : user.wishlist });
    } catch (error) {
        console.error("Erreur lors de la recuperation de la wishlist", error);
        res.status(500).json({ message : "Erreur interne du serveur"});
    }
}

export async function deleteWishlist (req,res){
    try {
        const { productId } = req.params;
        const user = req.user;

        // Vérifier si le produit est déjà dans la wishlist
        if(!user.wishlist.includes(productId)){
            return res.status(400).json({ message : "Produit non present dans la wishlist"})
        }

        user.wishlist.pull(productId);
        await user.save();
        res.status(200).json({ message : "Produit supprime de la wishlist avec succes", wishlist : user.wishlist})
    } catch (error) {
        console.error("Erreur lors de la suppression d'un produit de la wishlist", error);
        res.status(500).json({ message : "Erreur interne du serveur"});
    }
}