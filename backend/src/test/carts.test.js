import mongoose from "mongoose";
import express from 'express';
import { expect } from 'chai';
import supertest from 'supertest';
import sinon from 'sinon';
import CartManager from '../dao/mongoDB/mongomanagers/cartManagerMongo.js';
import router from '../routes/carts.router.js';


describe('Testing de Carts', function () {

    this.timeout(20000);

    let app;
    let request;
    let cartManager;


    before(async function () {
        this.timeout(3000);
        await mongoose.connect(`mongodb+srv://csalomon55:zLFPxBp8JYeluT8i@test.pf0hnay.mongodb.net/?retryWrites=true&w=majority&appName=testy`, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        app = express();
        app.use(express.json());
        app.use(router);
        request = supertest(app);
        cartManager = new CartManager();
        sinon.stub(CartManager.prototype.getCartById).callsFake(async (cartId) => {
            return { _id: cartId, quantity: quantity, title: title };
        });
    });

    beforeEach(function () {
        this.timeout(3000);
    });

    // it_01
    it('El Test debe devolver todos los carts en formato arreglo', async function () {
        expect(cartManager).to.exist;
        const emptyArray = [];
        const result = await cartManager.getCarts();
        expect(result).to.be.an('array'); // Verifica que el resultado es un array

    });
    // it_02
    it('la ruta debe retornar el  cart segun su  ID', async function () {
        const cartId = '665df2796e397ca9b80952a5'; //ID existente en la DB de Testing*** para contraprueba eliminar un numero del ID
        const response = await request.get(`/carts/${cartId}`);
        expect(response.status).to.equal(200);
        expect(response.body.status).to.equal('success');
        expect(response.body.carritofound._id).to.equal(cartId);
    });
    // it_03
    it("La ruta debe retornar 404 si el Cart no existe", async () => {
        //Given
        const response = await request
            .get(`/api/carts/123456`);
        //Assert
        expect(response.statusCode).is.eqls(404);
    });

});
