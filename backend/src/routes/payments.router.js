import { Router } from "express";
import { paymentsController } from "../controllers/payments.controllers.js";

const router = Router();

router.post("/payment-intents", paymentsController);

export default router;
