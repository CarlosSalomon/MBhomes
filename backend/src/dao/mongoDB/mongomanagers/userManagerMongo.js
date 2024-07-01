import { userModel } from "../models/user.model.js";

export default class userManager {


    getAllUsers = async () => {
        const users = await userModel.find().exec(); 
        return users;
    }
    getUserById = async (id) => {
        const user = await userModel.findById(id);
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    }

    getUsers = async (email) => {
        const user = await userModel.findOne({ email });
        return user;
    }

    getUser = async (condition) =>{
        const user = await userModel.findOne(condition)
        return user;
    }

    regUser = async (email, password, first_name, last_name, age, rol ) => {
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            throw new Error('Email already in use');
        }
        const newUser = await userModel.create({email, first_name, last_name, age, password, rol});
        
        return newUser;
    }

    logInUser = async (email, password)=> {
        const user = await userModel.findOne({ email, password })
        if(!user){
            throw new Error("Invalid credentials");
        }
        return user;
    }
    updateUser = async (id, user)=>{
        return await userModel.findByIdAndUpdate(id, user)
    }
    
}