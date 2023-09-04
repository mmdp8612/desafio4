import express from "express";
import { config } from "dotenv";
import { engine } from 'express-handlebars';
import path, { dirname } from 'path';
import { fileURLToPath } from "url";
import { Server } from "socket.io";
import routerProducts from "./routes/products.routes.js";
import routerCart from "./routes/cart.routes.js";
import ProductManager from "./class/ProductManager.js";

const productManager = new ProductManager();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

config();

const app = express();

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use("/api/products", routerProducts);
app.use("/api/cart", routerCart);

app.get("/view/products", (req, res) => {
    res.render("home");
});

app.get("/view/realtimeproducts", (req, res) => {
    res.render("realTimeProducts");
});

const server = app.listen(process.env.PORT, () => {
    console.log(`Server on port ${process.env.PORT}...`);
});

const io = new Server(server);

io.on('connection', (socket) => {
    console.log(`The user with id [${socket.id}] has connected`);
    
    socket.on("newProduct", async (product) => {
        const { title, description, price, code, stock, status, category } = product;        
        const estado = (status==1)?true:false;
        await productManager.addProduct(title, description, price, code, stock, estado, category);        
        const products = await productManager.getProducts();
        socket.emit("updateProducts", products);
    });

    socket.on("removeProduct", async (id) => {
        await productManager.deleteProduct(id);
        const products = await productManager.getProducts();
        socket.emit("updateProducts", products);
    })

    socket.on('disconnect', () => {
      console.log('The user has logged out');
    });
});
