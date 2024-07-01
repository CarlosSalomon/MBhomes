import { expect } from "chai";
import supertest from "supertest";

const requester = supertest("http://localhost:8080");

describe("Testing MBHomes App", () => {
 
  describe("Test de registro y login POST /register", () => {
    let cookie;
    before(async function () {

      this.mockUser = {
        email: "correoTest@gmail.com",
        name: "Nombre de prueba",
        lastname: "Apellido de prueba",
        age: "56",
        password: "123qwe",
      }

      // When
      const response = await requester.post("/register").send(this.mockUser);
      // Then

      const cookieString = response.headers['set-cookie'][0];
      const cookieParts = cookieString.split(';');
      const [cookieNameAndValue] = cookieParts;
      const [cookieName, cookieValue] = cookieNameAndValue.split('=');
      cookie = cookieValue;

      expect(response.statusCode).to.equal(302);

    });



    it("Test login de usuario: Debe iniciar sesión correctamente un usuario", async function () {
      const mockLogin = {
        email: this.mockUser.email,
        password: this.mockUser.password
      };
      const response = await requester
        .post('/login')
        .set('CoderCookie', cookie)
        .send(mockLogin);
      expect(response.statusCode).to.equal(302);
    });

    it("Test login de usuario: Debe devolver un error si el usuario no existe", async function () {
      let mockLog;
      let cookiee = "123456789";

      const response = await requester
        .post('/login')
        .set('CoderCookie', cookiee)
        .send(mockLog);


      expect(response.statusCode).to.equal(401);
      });
  });
});





