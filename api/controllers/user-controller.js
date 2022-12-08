import bcrypt from 'bcrypt';
import * as userService from "../services/user-service.js";
import { v4 as uuidv4 } from 'uuid';
import jwt from "jsonwebtoken";
import * as dotenv from 'dotenv/config';
import otpHandler from "../utils/emailVerification/OTPHandler.js";

let token;

// API Controller to get all the registered users in the system.
export const getAllRegisteredUsers = async (req, res) => {
    try {
        const registeredUsers = await userService.getRegisteredUsers();
        res.status(200).send(registeredUsers);
    }
    catch (e) {
        console.log(e);
        res.status(400).send({ "message": "Something went wrong." });
    }
}

//Register User Function
export const registerUser = async (request, response) => {
    const saltRounds = 10;
    let unique_id = uuidv4();

    try {
        if (request.body.password !== request.body.confirmPassword) {
            throw ({ msg: "password and confirm password did not match.", code: 400 })
        }

        const hashedPwd = await bcrypt.hash(request.body.password, saltRounds);

        const user = {
            id: unique_id,
            userName: request.body.userName,
            email: request.body.email,
            password: hashedPwd
        };

        const saveUser = await userService.createNewUser(user);
        const otpSecret = otpHandler.createNewOTP(request.body.email);
        response.status(201).send({ ...saveUser.toObject(), otpSecret: otpSecret });

    } catch (err) {
        console.log(err);
        if (err.code === 11000) {
            response.status(400).send({ msg: `User with email: ${request.body.email} already exists.` });
        } else {
            response.status(err.code ? err.code : 500).send({ msg: err.msg ? err.msg : 'Something went wrong in the server' });
        }

    }
}

//ReSend OTP Function
export const reSendOTP = async (request, response) => {

    try {
        if (!request.body.email) {
            throw ({ msg: 'email field is required', code: 400 })
        }

        const otpSecret = otpHandler.createNewOTP(request.body.email);
        response.status(201).send({ otpSecret: otpSecret });

    } catch (err) {
        response.status(err.code ? err.code : 500).send({ msg: err.msg ? err.msg : 'Something went wrong in the server' });
    }
}


//User Login Function
export const loginUser = async (request, response) => {
    try {
        if (!request.body.email) {
            throw ({ msg: 'email field is required', code: 400 })
        }

        if (!request.body.password) {
            throw ({ msg: 'password field is required', code: 400 })
        }

        const saveUser = await userService.getByEmail(request.body.email);
        if (saveUser) {
            if (saveUser.isVerified) {
                const cmp = await bcrypt.compare(request.body.password, saveUser.password);
                if (cmp) {
                    token = generateToken(saveUser.id);
                    response.status(200).send({ ...saveUser.toObject(), token: token });
                } else {
                    response.status(401).send({ msg: 'password did not match' });
                }
            } else {
                response.status(401).send({ msg: 'Email Not Verified' });
            }
        } else {
            response.status(400).send({ msg: `User with the email: ${request.body.email} does not exists.` })
        }

    } catch (err) {
        console.log(err)
        response.status(err.code ? err.code : 500).send({ msg: err.msg ? err.msg : `Something went wrong with the server.` })
    }

}

//Function for Generating Authentication Token
const generateToken = (id) => {
    return jwt.sign({ id: id }, process.env.JWT_SECRET, {
        expiresIn: '10m',
    })
}

//Email Verification Function
export const validateUserByEmail = async (request, response) => {
    try {
        if (!request.body.email) {
            throw ({ msg: 'email field is required', code: 400 });
        }

        console.log(request.body);
        const isValidOtp = otpHandler.verifyOTP(request.body.email, request.body.otpSecret, request.body.otp);
        console.log(`Is Valid OTP ${isValidOtp}`);
        if (isValidOtp) {
            const saveUser = await userService.updateVerifcationStatus(request.body.email, isValidOtp);

            console.log(saveUser);
            response.status(201).send({ msg: 'Email Sucessfully verified' });
        } else {
            response.status(401).send({ msg: 'Invalid OTP' });
        }
    } catch (err) {
        console.log(err)
        response.status(err.code ? err.code : 500).send({ msg: err.msg ? err.msg : `Something went wrong with the server.` })
    }
}


//Function to Update User Details by ID
export const updateUser = async (request, response) => {
    const saltRounds = 10;
    try {
        if (!request.body.userName) {
            throw ({ msg: 'userName field is required', code: 400 })
        }

        if (!request.body.password) {
            throw ({ msg: 'password field is required', code: 400 })
        }

        console.log(request.body);
        const hashedPwd = await bcrypt.hash(request.body.password, saltRounds);
        const user = {
            userName: request.body.userName,
            password: hashedPwd
        };

        console.log(request.params.userId);

        const saveUser = await userService.updateUserDetails(request.params.userId, user);
        console.log(saveUser);
        if (saveUser) {
            response.status(201).send({ ...saveUser.toObject(), token: token });

        } else {
            response.status(400).send({ msg: `User with the Id: ${request.params.userId} does not exists.` })
        }
    } catch (err) {
        console.log("error: ", err)
        response.status(err.code ? err.code : 500).send({ msg: err.msg ? err.msg : 'Something went wrong in the server' });
    }
}
