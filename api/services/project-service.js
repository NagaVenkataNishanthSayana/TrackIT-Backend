import projectModel from '../models/Project.js';
import taskModel from '../models/Task.js';
import userModel from '../models/User.js';

export const getProjectList = async () => {
    const projectList = projectModel.find({}, { _id: 0 }).exec();
    return projectList
}

export const deleteProject = async (projectId) => {
    const deleteObjectResult = await taskModel.deleteMany({ "projectId": projectId })
    const deletedCount = deleteObjectResult.deletedCount
    return projectModel.deleteOne({ "id": projectId }).exec();
}

export const getAdminId = async (projectId) => {
    const adminUser = projectModel.findOne({ "id": projectId }, { id: 1, adminUser: 1, _id: 0 }).exec();
    return adminUser
}

export const saveProject = async (project) => {
    const newProject = new projectModel(project);
    return newProject.save();
}

export const modifySpecificFieldsInProject = async (projectId, project) => {

    const { id, title, description, startDate, endDate, adminUser, users, taskIds } = project

    let updatedProjectObject = {
        "id": projectId,
        "title": title,
        "description": description,
        "startDate": startDate,
        "endDate": endDate,
        "adminUser": adminUser,
        "users": users,
        "taskIds": taskIds
    };
    const updatedProject = await projectModel.findOneAndUpdate({ "id": projectId }, updatedProjectObject, { new: true }).exec();
    return updatedProject;
}

export const getUserList = async (projectId) => {
    const userIdList = await projectModel.find({ "id": projectId }, { users: 1, _id: 0 }).exec();
    const userList = userModel.find({ id: { $in: userIdList[0]["users"] } }, { id: 1, userName: 1, email: 1, _id: 0 }).exec();
    return userList;
}

export const deleteUserFromProject = async (projectId, userId) => {

    const users = await getUserList(projectId);
    const updated_users = users.map((user) => user.id).filter((id) => id !== userId);

    await taskModel.updateMany({ "taskAssignedTo": userId, "projectId": projectId },
        { $set: { "taskAssignedTo": "NOT_ASSIGNED" } }, { new: true }).exec();

    return projectModel.updateOne({ "id": projectId }, { $set: { users: updated_users } }, { new: true }).exec();

}

export const getTasksByProjectId = async (projectId) => {
    return taskModel.find({ "projectId": projectId }, { _id: 0 }).exec();
}

export const getUserTaskList = async (projectId, userId) => {
    return taskModel.find({ $and: [{ "projectId": projectId }, { "taskAssignedTo": userId }] }, { _id: 0 })
}

export const saveTaskToProject = async (task) => {

    const newTask = new taskModel(task);

    const tasks = await getTasksByProjectId(task.projectId);
    const task_ids = tasks.map((t) => t.id);
    task_ids.push(task.id);

    await projectModel.updateOne({ "id": task.projectId }, { $set: { taskIds: task_ids } }, { new: true }).exec();

    return newTask.save();
}

export const deleteTaskFromProject = async (projectId, taskId) => {

    const tasks = await getTasksByProjectId(projectId);
    const updated_tasks = tasks.map((task) => task.id).filter((id) => id !== taskId)
    await projectModel.updateOne({ "id": projectId }, { $set: { taskIds: updated_tasks } }, { new: true }).exec();
    return taskModel.deleteOne({ "id": taskId }).exec();
}


export const modifySpecificFieldsInTask = async (projectId, taskId, task) => {

    const { taskName, taskLabel, description, dueDate, taskStatus, taskCreatedBy, taskAssignedTo, lastModifiedBy } = task

    let updatedTaskObject = {
        "id": taskId,
        "taskName": taskName,
        "taskLabel": taskLabel,
        "description": description,
        "projectId": projectId,
        "dueDate": dueDate,
        "taskStatus": taskStatus,
        "taskCreatedBy": taskCreatedBy,
        "taskAssignedTo": taskAssignedTo,
        "lastModifiedBy": lastModifiedBy
    };
    const updatedTask = await taskModel.findOneAndUpdate({ "id": taskId, "projectId": projectId }, updatedTaskObject, { new: true }).exec();
    return updatedTask;
}

export const getTaskStatusCounts = async (projectId) => {
    const taskStatusCounts = await taskModel.aggregate([
        { $match: { projectId: projectId } },
        { "$group": { _id: "$taskStatus", count: { $sum: 1 } } }
        
    ])
    return taskStatusCounts
}

export const getUserTaskStatusCounts = async (projectId, userId) => {
    const userTaskStatusCounts = await taskModel.aggregate([
        { $match: { "$and": [{ projectId: projectId }, { taskAssignedTo: userId }] } },
        { "$group": { _id: "$taskStatus", count: { $sum: 1 } } }
    
    ])
    return userTaskStatusCounts
}