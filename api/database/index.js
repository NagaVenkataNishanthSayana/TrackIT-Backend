import mongoose from 'mongoose';

const connectToMongoDB = async (connectionString) => {
    return await mongoose.connect(connectionString)
}

export default connectToMongoDB;