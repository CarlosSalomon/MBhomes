import { PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { createAlert, createAlertWithCallback } from '../../../utils/alerts';

import styles from '../Stripe.module.scss';
const PaymentForm = ({tid}) => {
    const stripe = useStripe();
    const elements = useElements();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { error, paymentIntent } = await stripe.confirmPayment({
            elements,
            redirect: 'if_required'
        })
        if (!error) {
            createAlertWithCallback('success','¡Pago completado!',`<p>El pago ha sido procesado con éxito.</p>
            <br/>
            Revisá el detalle en tu correo electronico.`,()=>{
                fetch(`http://localhost:8080/api/email?tid=${tid}`);
                window.location.replace('http://localhost:8080/productos');
            })
        } else {
            console.log(error);
           createAlert('error','Error al procesar el pago',error.message)
        }
    }
    return <>
        <form className='bg-opacity-8 border rounded mt-5 p-4'>
            <PaymentElement />
            <div className={styles.buttonPanel}>
                <button className='btn btn-primary mt-3 w-25' onClick={handleSubmit}>Pagar</button>
            </div>
        </form>
    </>
}
export default PaymentForm;