import React, { useEffect, useState } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import PaymentForm from "./components/PaymentForm";
import { useParams } from "react-router-dom";
import Wrapper from "../../components/Wrapper";
import ProductCard from "./components/ProductCard";
import PaymentService from "../../services/paymentService";
import './Stripe.module.scss';


const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_KEY);

const Stripe = () => {
  const [currentProducts, setCurrentProducts] = useState([]);
  const [clientSecret, setClientSecret] = useState(null);
  const [payment, setPayment] = useState(null);

  const { tid } = useParams();
  useEffect(() => {
    fetch(`http://localhost:8080/ticket/${tid}`).then((result) => {
      result.json().then((json) => {
        
        setCurrentProducts(json.ticket.products);
        
      });
    });
  }, [tid, currentProducts]);// eslint-disable-next-line

  useEffect(() => {
    const getClientSecret = async () => {
      const service = new PaymentService();
      service.createPaymentIntent({
        ticketId: tid,
        callbackSuccess: callbackSuccessPaymentIntent,
        callbackError: callbackErrorPaymentIntent,
      });
    };
    payment && getClientSecret();
  }, [tid, payment]);

  const callbackSuccessPaymentIntent = (res) => {
    setClientSecret(res.data.payload.client_secret);
  };

  const callbackErrorPaymentIntent = (err) => {
    console.log(err);
  };

  const totalAmount = currentProducts.reduce((total, product) => total + product.amount, 0);

  return (
    <div className="container-md containercomp">
      <Wrapper hidden={payment}>
        <h1 className="mt-4 mb-4 bg-opacity-8 border rounded text-center">
          DETALLES DE COMPRA
        </h1>
      </Wrapper>
      <Wrapper hidden={!payment}>
        <h1 className="mt-4 mb-4 bg-opacity-8 border rounded text-center">
          MEDIOS DE PAGO
        </h1>
      </Wrapper>
      <div className="d-flex justify-content-between bg-opacity-8 border rounded pt-1 pb-1 mb-4">
        <button
          id="home"
          className="btn btn-outline-secondary mx-2"
          onClick={() =>
            window.location.replace(`http://localhost:8080/productos`)
          }
        >
          Home
        </button>
        <div>
          <h4>Total: ${totalAmount}</h4>
        </div>
        
      
      </div>
      <Wrapper hidden={payment}>
        <div className="container row d-flex justify-content-start text-center ">
          {currentProducts.map((products) => (
            <ProductCard key={products.updatedProduct._id} products={products} />
          ))}
        </div>
        <div className="text-center mb-4">
          <button
            className="btn btn-primary w-25"
            onClick={() => setPayment(tid)}
          >
            Ir a pagar
          </button>
        </div>
      </Wrapper>
      <Wrapper hidden={!clientSecret || !stripePromise}>
        <Elements
          stripe={stripePromise}
          options={{ clientSecret: clientSecret }}
        >
          <PaymentForm tid={tid} />
        </Elements>
      </Wrapper>
    </div>
  );
};

export default Stripe;
