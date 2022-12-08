import mongoose from 'mongoose';

// connect to MongoDB, return the DB object.
const connectToMongoDB = async (connectionString) => {
    return await mongoose.connect(connectionString)
}

export default connectToMongoDB;