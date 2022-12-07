import mongoose from 'mongoose';

// Task Schema 
const schema = new mongoose.Schema({
    id: {
        type: String,
        unique: true,
        required: 'id field is required'
    },
    taskName: {
        type: String,
        required: 'Task Name is required'
    },
    projectId: {
        type: String,
        required: 'projectId is required'
    },
    description: {
        type: String,
        required: 'description is required'
    },
    dueDate: {
        type: Date,
        required: 'DueDate is required'
    },
    taskStatus: {
        type: [{
            type: String,
            enum: ['CREATED', 'IN_PROGRESS', 'DONE'],
            required: true
        }],
        default: ['CREATED']
    },
    taskLabel: {
        type: [{
            type: String,
            enum: ['FEATURE', 'BUG'],
            required: true
        }],
        default: ['FEATURE']
    },
    taskCreatedBy: {
        type: String,
        required: 'taskCreatedBy field is required'
    },
    taskAssignedTo: {
        type: String,
        default: "NOT_ASSIGNED",
        required: 'taskAssignedTo field is required'
    },
    lastModifiedBy: {
        type: String,
        required: 'lastModifiedBy field is required'
    }
}, { versionKey: false, timestamps: true })

const taskModel = mongoose.model('task', schema);

export default taskModel
