import { expect } from "chai";
import supertest from "supertest";

const requester = supertest("http://localhost:8080")
let uid;



describe("Testing Product api MBHomes app", () => {

  it("Testeando el traer todos los Productos con /api/products", async () => {
    const { statusCode, ok, body } = await requester.get("/api/products")
    expect(statusCode).is.equals(200);
    expect(ok).is.equals(true);
    expect(body).to.be.an("object");

  })

  it("Testeando el traer un Producto especifico por id con /api/products/:pid", async () => {
    const pid = "65ff4fbb3b1c8331196b1311"

    const response = await requester.get(`/api/products/${pid}`)
    expect(response.status).to.equal(200);
    expect(response.body).to.be.an("object")
  })

  it("Crear prducto: El API POST /api/products debe crear un producto correctamente", async () => {
    //Given
    const product = {
      title: "Testing product",
      description: "Product to test",
      code: "Test1",
      price: 10,
      stock: 4,
      thumbnail: "https://www.google.com",
      category: "Testing",
      owner: "test@gmail.com"
    };

    //Then
    const response = await requester
      .post("/api/products")
      .send(product);
    uid = response.body.newproduct._id;

    //Assert
    expect(response.body.newproduct._id).to.be.ok;
    expect(response.statusCode).is.eqls(200);
  });

})

after(async function () {
  const result = await requester.delete(`/api/products/${uid}`);
});

