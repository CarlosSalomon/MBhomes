import Stripe from "stripe";
import config from "../config/config.js";



export default class PaymentService {
  
  constructor() {


    this.stripe = new Stripe(config.STRIPE_APP_SECRET_KEY);
  }
  createPaymentIntent = async (data) => {
    // Asegúrate de que 'ticketId' es una cadena
    if (data.metadata && data.metadata.ticketId) {
      data.metadata.ticketId = String(data.metadata.ticketId);
    }

    const paymentIntent = await this.stripe.paymentIntents.create(data);
    console.log("Stripe result:");
    return paymentIntent;
  };

}
