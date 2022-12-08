import userModel from '../models/User.js';

// Fetch all registered users from database. 
export const getRegisteredUsers = async () => {
    const registeredUsers = userModel.find({}, { id: 1, userName: 1, email: 1, _id: 0 }).exec();
    return registeredUsers
}

//Function to create a new User in Database.
export const createNewUser = async (user) => {
    console.log("service: ", user);
    const newUser = new userModel({...user});
    return newUser.save();
}

//Function to getBy UserName.
export const getByEmail = async (email) => {
    return await userModel.findOne({"email": email}).exec();
}

// Function to update User Details in Database
export const updateUserDetails = async (id, user) => {

    let updateUser = { "userName": user.userName, "password": user.password };

    return await userModel.findOneAndUpdate({"id": id}, updateUser, {new: true}).exec();
}

// Function to update User Verification Details
export const updateVerifcationStatus = async (email, isVerified) => {

    let updateUser = { "isVerified": isVerified };

    return await userModel.findOneAndUpdate({"email": email}, updateUser, {new: true}).exec();
}