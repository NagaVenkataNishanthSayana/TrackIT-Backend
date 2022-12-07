import mongoose from 'mongoose';

// Project Schema 
const schema = new mongoose.Schema({
    id: {
        type: String,
        unique: true,
        required: 'id field is required'
    },
    title: {
        type: String,
        required: 'title is required'
    },
    description: {
        type: String,
        required: 'description is required'
    },
    startDate: {
        type: Date,
        required: 'startDate is required'
    },
    endDate: {
        type: Date,
        required: 'endDate is required'
    },
    adminUser: {
        type: String
    },
    users: [{ type: String }],
    taskIds: [{ type: String }]
}, {versionKey: false, timestamps: true})

const projectModel = mongoose.model('project', schema);

export default projectModel

   