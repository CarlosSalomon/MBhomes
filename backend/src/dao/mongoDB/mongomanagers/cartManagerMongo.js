import { cartModel } from "../models/carts.model.js"
import { userService } from "../../../repository/index.js"
import { v4 as uuidv4 } from "uuid";
import { createTickete } from "./ticketManagerMongo.js";	

class CartManager {
    getCarts = async () => {
        try {
            const carts = await cartModel.find();
            return carts;
        } catch (err) {
            console.error('Error al obtener los carritos:', err.message);
            return [];
        }
    };
    createCart = async () => {
        try {
            const newCart = {
                products: [],
            }
            const createdCart = await cartModel.create(newCart)
            if (!createdCart) {
                throw new Error('Cart creation failed.')
            }
            return createdCart
        } catch (error) {
            if (error == 'Cart creation failed.') {
                throw error
            } else {
                throw new Error(error)
            }
        }
    }
    getCartById = async (cartId) => {
        try {
            const cart = await cartModel.findById(cartId).lean()
            return cart;
        } catch (err) {
            console.error('Error al obtener el carrito por ID:', err.message);
            return null;
        }
    };


    addCart = async (products) => {
        try {
            let cartData = {};
            if (products && products.length > 0) {
                cartData.products = products;
            }

            const cart = await cartModel.create(cartData);
            return cart;
        } catch (err) {
            console.error('Error al crear el carrito:', err.message);
            return err;
        }
    };
    addProductInCart = async (cid, obj, id, quantity) => {
        try {
            const cart = await cartModel.findById(cid);
            // Verificar si el producto ya está en el carrito
            const existingProduct = cart.products.find(product => product._id.toString() === id);
            if (existingProduct) {
                // Actualizar la cantidad del producto en el carrito
                existingProduct.quantity += quantity;
            } else {
                // Agregar el producto al carrito con la cantidad especificada
                cart.products.push({
                    _id: obj._id,
                    quantity: quantity,
                    title: obj.title,
                    price: obj.price
                });
            }
            await cart.save();
            return await cartModel.findById(cid);
        } catch (err) {
            console.error('Error al agregar el producto al carrito:', err.message);
            return err;
        }
    };
    removeallProductFromCart = async (cartId) => {
        const cart = await cartModel.findById(cartId)
        cart.products = [];
        await cart.save();
    }
    removeProductFromCart = async (cartId, productId) => {
        try {
            const cart = await cartModel.findById(cartId);
            // Encontrar el índice del producto en el carrito
            const productIndex = cart.products.findIndex((product) => product._id.toString() === productId);
            if (productIndex !== -1) {
                // Eliminar el producto del carrito
                cart.products.splice(productIndex, 1);
                await cart.save();
                return await cartModel.findById(cartId);
            } else {
                throw new Error('El producto no se encontró en el carrito');
            }
        } catch (err) {
            console.error('Error al eliminar el producto del carrito:', err.message);
            return err;
        }
    };

    stockControl = async (cart) => {
        console.log(cart)
        let purchaseCart = [];
        for await (const el of cart.products) {
            console.log(el)
            const quantity = el.quantity;
            const newStock = 100 - quantity;
            if (newStock >= 0) {
                const pid = el._id;
                const cartNew = await this.removeallProductFromCart(cart._id);
                // Esperar a que se actualice el producto
                const amount = el.quantity * el.price;
                const updatedProduct = el
                const purchaseProduct = { updatedProduct, amount, quantity };
                purchaseCart.push(purchaseProduct);
            }
        }
        return purchaseCart;
    };

    createTicket = async (cart, user) => {
        const totalAmount = cart.reduce((acumulador, objeto) => {
            return acumulador + objeto.amount;
        }, 0);
        const ticket = {
            code: autoGenerateCode(),
            amount: totalAmount,
            purchaser: "email",
            purchase_datetime: new Date(),
            products: cart,
        };
        return await createTickete(ticket);
        //return ticket
    }

    createPurchase = async (cid) => {
        try {
            const cart = await cartModel.findById(cid);
            const newCart = await this.stockControl(cart);
            if (newCart.length === 0) {
                throw Error("Stock insuficiente")
            }
            const cartId = cart._id;
            const user = await userService.getUser({ cart: cartId });
            const ticket = await this.createTicket(newCart, user);
            const secondcart = await cartModel.findById(cid);
            return ticket;
        } catch (e) {
            console.log(e)
            throw Error(e.message)
        }
    }
};


const autoGenerateCode = () => {
    return uuidv4() + Math.random();
};

export default CartManager;