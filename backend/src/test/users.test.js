import mongoose from "mongoose";
import userManager from '../dao/mongoDB/mongomanagers/userManagerMongo.js'
import { expect } from 'chai';


mongoose.connect(`mongodb+srv://csalomon55:zLFPxBp8JYeluT8i@test.pf0hnay.mongodb.net/?retryWrites=true&w=majority&appName=testy`);

describe('Testing de Users', () => {

    // before
    before(function () {
        this.userManager = new userManager();
    });

    // beforeeach
    beforeEach(async function () {
        this.timeout(5000); // Tiempo de espera ya que estamos usando una DB
        await mongoose.connection.collections.user.drop(); // Limpia la colección de usuarios antes de cada prueba
    });

    // it_01
    it('El Test debe devolver todos los usuarios en formato arreglo', async function () {
        // Given
        const emptyArray = [];

        // Then
        const result = await this.userManager.getAllUsers();

        // Assert
        expect(result).to.be.deep.equal(emptyArray);
        expect(Array.isArray(result)).to.be.ok;
        expect(Array.isArray(result)).to.be.equal(true);
        expect(result.length).to.be.deep.equal(emptyArray.length);
    });

    // it_02
    it('El test debe agregar un usuario correctamente en la DB de testing', async function () {
        // Given
        let mockUser = {
            email: `test_${Date.now()}@gmail.com`, // Usa un correo único
            password: "123qwe",
            first_name: "Usuario de prueba_01",
            last_name: "Usuario de prueba_01",
            age: 25,
            rol: "user"
        };

        // Then
        const result = await this.userManager.regUser(mockUser.email, mockUser.password, mockUser.first_name, mockUser.last_name, mockUser.age, mockUser.rol);

        // Assert
        expect(result._id).to.be.ok;
    });

    it('El Test debe actualizar un usuario correctamente en la DB', async function () {
        // Given
        let mockUser = {
            email: `test_${Date.now()}@gmail.com`, // Usa un correo único
            password: "123qwe",
            first_name: "Usuario de prueba_05",
            last_name: "Usuario de prueba_01",
            age: 30,
            rol: "user"
        };

        // Agrego el usuario inicialmente
        const createdUser = await this.userManager.regUser(mockUser.email, mockUser.password, mockUser.first_name, mockUser.last_name, mockUser.age, mockUser.rol);
        const userId = createdUser._id;

        // Datos para actualizar
        let updatedData = {
            first_name: "Usuario Actualizado",
            age: 35
        };

        console.log('Before update:', createdUser);

        // Then
        const updatedUser = await this.userManager.updateUser(userId, updatedData);

        // Fetch updated user
        const fetchedUpdatedUser = await this.userManager.getUserById(userId);

        console.log('After update:', fetchedUpdatedUser);

        // Assert
        expect(fetchedUpdatedUser.first_name).to.be.equal(updatedData.first_name);
        expect(fetchedUpdatedUser.age).to.be.equal(updatedData.age);
    });

    // after
    after(async function () {
        await mongoose.connection.close();
    });
});
