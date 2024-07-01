import passport from "passport";
import bcrypt from "bcrypt";
import { userModel } from "../dao/mongoDB/models/user.model.js";
import { userService } from "../repository/index.js";
import {dataUri} from "../utils.js"
import { v2 } from "../config/config.js";


class usersControllers {

    static home = async (req, res) => {
        res.render('home')
    }
    static chat = async (req, res) => {
        res.render('chat')
    }
    static login = async (req, res) => {
        res.render('login')
    }
    static logout = async (req, res) => {
        const user = req.session.user
        req.session.destroy(async(err) => {
            if (err) res.send('Failed Logout')
                
                const time = `${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}`;
                const userLog = await userService.getUsers(user.email)
                const userID = userLog._id
                const timeLogout = (time + " - " + "Logout")
                console.log(timeLogout)
                const resp = await userService.updateUser(userID, {last_connection: timeLogout })
            res.redirect('/')
        })
    }
    static register = async (req, res) => {
        res.render('register')
    }
    static failLogin = async (req, res) => {
        res.send({ error: "Failed login Strategy" })
    }
    static profile = async (req, res) => {
        const userlog = req.session.user
        const userdate = await userService.getUsers(userlog.email)
        const user = userdate.toObject();
        console.log(user)

        res.render('profile', { user })
    }

    static failedregister = async (req, res) => {
        res.send({ error: "Failed Strategy" })
    }
    static registerOk = async (req, res) => {
        res.redirect('/login')
    }

    
    static logindb = async (req, res, next) => {
        passport.authenticate('login', async (err, user, info) => {
            try {
                if (err) {
                    return next(err);
                }
                if (!user) {
                    return res.render('login', { error: "credenciales invalidas" });
                }
                req.login(user, async (loginErr) => {
                    if (loginErr) {
                        return next(loginErr);
                    }
                    req.session.user = {
                        email: user.email,
                        name: user.first_name,
                        age: user.age,
                        lastname: user.last_name,
                        rol: user.rol,
                    };
                    const time = `${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}`;
                    const userLog = await userService.getUsers(user.email)
                    const userID = userLog._id
                    const timeLogin = (time + " - " + "Login")
                    const resp = await userService.updateUser(userID, {last_connection: timeLogin })
                    return res.redirect('/productos')

                });
            } catch (error) {
                return next(error);
            }
        })(req, res, next);
    }

    
    static handlePasswordReset = async (req, res) => {
        const { token, newPassword } = req.body;

        // Verifico si el token es válido y no ha expirado
        const user = await userModel.findOne({ resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } });
        if (!user) {
            return res.redirect('/api/email/expired-link');
        }

        // Verifico si la nueva contraseña es diferente de la anterior
        const isSamePassword = await bcrypt.compare(newPassword, user.password);
        if (isSamePassword) {
            return res.render('reset-password', { token, error: "La nueva contraseña no puede ser la misma que la anterior" });
        }

        // Actualizo la contraseña en la base de datos
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.send({ message: "Contraseña actualizada correctamente" });
    }

    static changeRolController = async (req, res) => {

        const uid = req.params.uid
        console.log(uid)
        const user = req.session.user
        console.log(user)

        try {
            if (user.rol === "premium") {
                
                await userService.updateUser(uid, { rol: "user", admin: "false" }  )
                return res
                    .status(200)
                    .send({ message: 'rol modificado a user correctamente' })
            }
            
            const userInfo = await userService.getUser({
                _id: uid,
                documents: {
                    $elemMatch: { name: "Identificacion" },
                    $elemMatch: { name: "Domicilio" },
                    $elemMatch: { name: "Cuenta" }
                },
            })

            console.log(userInfo)

            if(userInfo){
            await userService.updateUser(uid, { rol: "premium", admin: "true" })
            return res
                .status(200)
                .send({ message: 'rol modificado a premium correctamente' })
            } else{
                return res.status(400).json({
                    error:
                        "Para ser usuario Premium es necesario completar toda la documentación",
                });
            }
        } catch (error) {
            res.status(404).json({
                error: error.message
            });
        }
    }

    static documentsController = async (req, res) => {
        const {uid} = req.params;
        const files = req.files[0];
        const documento = req.body.doc;
        if(files){
            try {
                const file = dataUri(files).content;
                const result = await v2.uploader.upload(file, {
                    folder: "Ecommerce/Documents",
                });
                console.log(result)
                const image = result.url;
                const newDocument = {
                    name: documento,
                    reference: image,
                };
                const user = await userService.getUser({ _id: uid });
                let userDocuments = user.documents;
                const findDoc = userDocuments.find((doc) => doc.name === documento);
                if(!findDoc){
                    userDocuments = [...userDocuments, newDocument];
                }else{
                    const index = userDocuments.findIndex((doc) => doc.name === documento);
                    userDocuments[index] = newDocument;
                }
                await userService.updateUser(uid, { documents: userDocuments });
                return res.status(200).json({ 
                    messge: "Your documents has been uploded successfully to cloudinary", 
                });
            } catch (error) {
                res.status(500).json({
                    message: "someting went wrong while processing your request",
                    data:{
                        error,
                    }
                })
            }
        }else {
            return res.status(400).json({message: "No files were provided in the request"})
        }
    }
}

export { usersControllers }
