export async function getProductById(req,res) {
    try {
        const { id } = req.params;
        const product = await Product.findById(id);

        if(!product){
            res.status(404).json({ message : `Produit avec cet id : ${id} n'existe pas`})
        }

        res.status(200).json({ product });
    } catch (error) {
        console.error("Erreur lors de la recuperation du produit", error);
        res.status(500).json({ message : "Erreur interne du serveur"});
    }
}