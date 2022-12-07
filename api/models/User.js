import mongoose from 'mongoose';

// User Schema 
const schema = new mongoose.Schema({
    id: {
        type: String,
        unique: true,
        required: 'id field is required'
    },
    userName: {
        type: String,
        required: 'User Name is required'
    },
    email: {
        type: String,
        unique: true,
        required: 'email is required'
    },
    password: {
        type: String,
        required: 'password is required'
    },
    isVerified:{
        type:Boolean,
        default:false
    }

}, {versionKey: false, timestamps: true})

const userModel = mongoose.model('user', schema);

export default userModel