import PaymentService from "../payments/PaymentsService.js";
import { getTicketById } from "../dao/mongoDB/mongomanagers/ticketManagerMongo.js";



export const paymentsController = async (req, res) => {
    console.log(`Ticket id: ${req.query.tid}`);
    try {
        const ticket = await getTicketById({ _id: req.query.tid });

        const paymentIntentInfo = {
            amount: ticket.amount,
            currency: "usd",
            metadata: {
                ticketId: ticket._id,
            },
        };

        const service = new PaymentService();
        let result = await service.createPaymentIntent(paymentIntentInfo);
        res.send({ status: "success", payload: result });
    } catch (error) {
        console.error(error);
        return res
            .status(500)
            .send({
                status: "error",
                error: "Ocurrio un erro con el proveedor externo.",
            });
    }
};
