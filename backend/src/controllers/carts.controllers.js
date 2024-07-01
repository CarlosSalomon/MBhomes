import { cartService, productsService, userService } from "../repository/index.js"
import { createTickete, getTicketById } from "../dao/mongoDB/mongomanagers/ticketManagerMongo.js";
import CustomError from "../dao/errors/CustomError.js";
import { addCartErrorInfo } from "../dao/errors/messages/cart-creation-error-message.js";
import EErrors from "../dao/errors/errors-enums.js";


class CartController {

    static getCartById = async (req, res) => {
        const logUser = req.session.user;
        const user = await userService.getUsers(logUser.email)
        const cartId = user.cartId
        const productsInCart = await cartService.getCartsById(cartId)
        const productList = Object.values(productsInCart.products)
        res.render("partials/cart", { productList, cartId })
    }

    static emptyCart = async (req, res) => {
        try {
            const logUser = req.session.user;
            const user = await userService.getUsers(logUser.email)
            const cartId = user.cartId
            const cart = await cartService.removeallProductFromCart(cartId);
            res.status(200).json({ message: 'Carrito vaciado exitosamente' });
        } catch (error) {
            console.error('Error al vaciar el carrito:', error);
            res.status(500).json({ error: 'Error al vaciar el carrito' });
        }
    }

    static deleteCart = async (req, res) => {
        try {
            const { productId } = req.body;
            const logUser = req.session.user;
            const user = await userService.getUsers(logUser.email)
            const cartId = user.cartId
            const removeCartProduct = await cartService.removeProductFromCart(cartId, productId);
            // En lugar de enviar un script con alert y redirección, puedes enviar un mensaje JSON de éxito
            res.json({ success: true, message: 'Producto eliminado del carrito' });
        } catch (error) {
            console.error('Error al agregar producto al carrito:', error);
            res.status(500).json({ message: 'Error al agregar producto al carrito' });
        }
    }

    static addToCart = async (req, res) => {
        try {
            const { productId, quantity } = req.body; // Obtener la cantidad del cuerpo de la solicitud

            const logUser = req.session.user;
            const user = await userService.getUsers(logUser.email)
            const cartId = user.cartId
            const cart = await cartService.getCartsById(cartId);
            const id = productId;
            const productDetails = await productsService.getProductById(productId);
            if (productDetails.owner !== user.email) {
                if (productId) {
                    if (productDetails.stock >= quantity) {
                        const addedProduct = await cartService.addProductInCart(cartId, productDetails, id, quantity); // Pasar la cantidad al método addProductInCart
                    } else {
                        console.error('Error al agregar producto al carrito:', error);
                        res.status(500).json({ message: 'No hay stock suficiente' });
                    }
                }
                res.json({ success: true, message: 'Producto agregado al carrito' });
            } else {
                const error = CustomError.createError({
                    name: "Product Stock Error",
                    cause: addCartErrorInfo,
                    message: `No hay suficioen stock`,
                    code: EErrors.INADEQUATE_STOCK_ERROR,
                })

            }
        } catch (error) {
            console.error('Error al agregar producto al carrito:', error);
            res.status(500).json({ message: 'No hay stock suficiente' });
        }
    }

    static finishPurchaseController = async (req, res) => {
        try {
            const logUser = req.session.user;
            const user = await userService.getUsers(logUser.email)
            const cartId = user.cartId
            const cart = await cartService.getCartsById(cartId);
            let total_price = 0;
            let unstocked_products = [];
            for (const item of cart.products) {
                const id = item._id
                const quantity = item.quantity
                let product = await productsService.getProductById(id);
                if (product) {
                    if (product.stock >= item.quantity) {
                        total_price += item.quantity * product.price;
                        product.stock -= quantity;
                        await productsService.updateProduct(id, product);
                    } else {
                        unstocked_products.push({ product: product._id, quantity: item.quantity });
                    }
                } else {
                    // Manejar el caso en el que no se encuentra el producto

                }
            }

            if (total_price > 0) {

                cart.products = unstocked_products

                let newCart = await productsService.updateProduct(req.params.cid, cart)
                const user = req.session.user

                const ticket = ({ code: `${req.session.user.last_name}_${Date.now()}`, amount: total_price, purchaser: req.session.user.email })

                let newTicket = await createTickete(ticket)

                return res.status(201).json({ message: "Ticket creado exitosamente" });
            }
            else {
                return res.status(404).json({ message: "No se realizó ninguna compra" })
            }

        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    static createPurchaseController = async (req, res) => {
        const { cid } = req.params;
        try {
            const response = await cartService.createPurchase(cid);
            res.json({
                mensaje: `Tu compra se ha generado con exito`,
                purchase: response,
            });
        } catch (e) {
            if (e.message != "Stock insuficiente") {
                res.status(500).json({
                    error: e.message,
                });
            } else {
                res.status(404).json({
                    error: e.message,
                });
            }
        }
    }

    static getTicketController = async (req, res) => {
        const { tid } = req.params;
        try {
            const ticket = await getTicketById(tid);
            res.json({
                ticket: ticket,
            });
        } catch (error) {
            res.status(404).json({
                error: error.message,
            });
        }
    }

}

export { CartController }



