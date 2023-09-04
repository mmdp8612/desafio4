import ProductManager from "../class/ProductManager.js";

const productManager = new ProductManager();

const getAllProducts = async (req, res) => {
    const { limit } = req.query;
    const products = await productManager.getProducts(limit);   
    res.status(200).json({
        data: products
    })
}

const getProductById = async (req, res) => {
    const { id } = req.params;
    const product = await productManager.getProductById(id);
    res.status(200).json({
        data: product
    })
}

const postProduct = async (req, res) => {
    const { title, description, price, thumbnail, code, stock, status, category } = req.body;
    try{
        await productManager.addProduct(title, description, price, code, stock, status, category, thumbnail);
        return res.status(200).json({
            message: "Product created!"
        })
    }catch(error){
        return res.status(500).json({
            error: error.message
        })  
    }
}

const updateProduct = async (req, res) => {
    const { id } = req.params;
    try{
        await productManager.updateProduct(id, req.body);
        return res.status(200).json({
            message: "Product updated!"
        })
    }catch(error){
        return res.status(500).json({
            error: error.message
        })  
    }
}

const deleteProduct = async (req, res) => {
    const { id } = req.params;
    try{
        await productManager.deleteProduct(id);
        return res.status(200).json({
            message: "Product deleted!"
        })
    }catch(error){
        return res.status(500).json({
            error: error.message
        })  
    }
}

export {
    getAllProducts,
    getProductById,
    postProduct,
    updateProduct,
    deleteProduct
}