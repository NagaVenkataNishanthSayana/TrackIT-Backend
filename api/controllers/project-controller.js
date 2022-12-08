import * as projectService from '../services/project-service.js';
import { validatePayload, validateId } from "../utils/common.js"
import { v4 as uuidv4 } from 'uuid';

// API Controller to fetch all the projects.
export const getAllProjects = async (req, res) => {
    try {
        const projectList = await projectService.getProjectList(); // call to service layer
        res.status(200).send(projectList);
    } catch (e) {
        console.log(e);
        res.status(400).send({ "message": "Something went wrong." });
    }
}

// API Controller to delete a Project, given its ID and user admin flag.
export const deleteProjectById = async (req, res) => {
    try {
        const { projectId } = req.params
        const { isProjectAdmin } = req.query
        validateId("Project", projectId)
        if (isProjectAdmin === "false") {
            throw ({ code: 403, message: `Only Project Admin can delete Project ${projectId}` })
        }
        const deletedProject = await projectService.deleteProject(projectId);

        if (deletedProject.deletedCount === 0) {
            throw ({ code: 404, message: `Entity doesn't exist with Project id: ${projectId}` });
        }
        res.status(204).send(deletedProject);
    } catch (e) {
        console.log(e);
        res.status(e.code ? e.code : 500).send({ "message": e.message ? e.message : "Something went wrong." });
    }
}

// API Controller to get admin user of a given Project.
export const getAdminById = async (req, res) => {

    try {
        const { projectId } = req.params
        validateId("Project", projectId)
        const adminUser = await projectService.getAdminId(req.params.projectId);
        if (!adminUser) {
            throw ({ code: 404, message: `User Entity doesn't exist with Project id: ${projectId}` });
        }
        res.status(200).send(adminUser);
    } catch (e) {
        console.log(e);
        res.status(e.code ? e.code : 500).send({ "message": e.message ? e.message : "Something went wrong." });
    }
}

// API Controller to create a Project.
export const createProject = async (req, res) => {
    try {
        let projectId = uuidv4()
        const validationString = validatePayload(req.body, ["title", "description", "startDate", "endDate", "adminUser", "users", "taskIds"])
        if (!validationString.status) {
            throw ({ code: 400, message: validationString.message })
        }
        const project = await projectService.saveProject({ ...req.body, id: projectId });
        res.status(201).send(project);
    }
    catch (e) {
        console.log(e)
        res.status(e.code ? e.code : 500).send({ "message": e.message ? e.message : "Something went wrong." });
    }
}


// API Controller to update a Project.
export const updateProject = async (req, res) => {
    try {
        const { projectId } = req.params
        validateId("Project", projectId)
        const validationString = validatePayload(req.body, ["title", "description", "startDate", "endDate", "users", "taskIds", "adminUser"])
        if (!validationString.status) {
            throw ({ code: 400, message: validationString.message })
        }

        const updatedProject = await projectService.modifySpecificFieldsInProject(projectId, req.body);
        if (!updatedProject) {
            throw ({ code: 404, message: `Entity doesn't exist with project id: ${projectId}` });
        }
        res.status(200).send(updatedProject);
    }
    catch (e) {
        console.log(e);
        res.status(e.code ? e.code : 500).send({ "message": e.message ? e.message : "Something went wrong." });
    }
}

// API Controller to get all Users of a given project. 
export const getAllUsersByProjectId = async (req, res) => {
    try {
        const { projectId } = req.params
        validateId("Project", projectId)
        const userList = await projectService.getUserList(projectId); // call to service layer
        res.status(200).send(userList);
    } catch (e) {
        console.log(e);
        res.status(e.code ? e.code : 500).send({ "message": e.message ? e.message : "Something went wrong." });
    }
}

// API Controller to delete user from a given project. 
export const removeUserFromProject = async (req, res) => {
    try {
        const { projectId, userId } = req.params
        const { isProjectAdmin } = req.query
        validateId("Project", projectId)
        console.log(isProjectAdmin, typeof isProjectAdmin);
        if (isProjectAdmin === "false") {
            throw ({ code: 403, message: `Only Project Admin can remove user: ${userId} from Project: ${projectId}` })
        }
        validateId("Project", projectId)
        validateId("User", userId)
        const deletedUser = await projectService.deleteUserFromProject(projectId, userId);

        if (deletedUser.deletedCount === 0) {
            throw ({ code: 404, message: `Entity doesn't exist with User id: ${userId}` });
        }
        res.status(204).send({});
    } catch (e) {
        console.log(e);
        res.status(e.code ? e.code : 500).send({ "message": e.message ? e.message : "Something went wrong." });
    }
}

// API Controller to get all tasks from a given project.
export const getAllTasksByProjectId = async (req, res) => {
    try {
        const { projectId } = req.params
        validateId("Project", projectId)

        const taskList = await projectService.getTasksByProjectId(projectId);
        res.status(200).send(taskList);
    } catch (e) {
        console.log(e);
        res.status(e.code ? e.code : 500).send({ "message": e.message ? e.message : "Something went wrong." });
    }
}

// API Controller to get all tasks of a particular user, from a given project.
export const getAllUserTasksByProjectId = async (req, res) => {
    try {
        const { projectId, userId } = req.params
        validateId("Project", projectId)
        validateId("User", userId)
        const userTaskList = await projectService.getUserTaskList(projectId, userId); // call to service layer
        res.status(200).send(userTaskList);
    } catch (e) {
        console.log(e);
        res.status(e.code ? e.code : 500).send({ "message": e.message ? e.message : "Something went wrong." });
    }
}

// API Controller to get all task status and their counts.
export const getTasksAnalytics = async (req, res) => {
    try {
        const { projectId } = req.params
        validateId("Project", projectId)
        const taskStatusCounts = await projectService.getTaskStatusCounts(projectId);
        res.status(200).send(taskStatusCounts);
    } catch (e) {  
        console.log(e);
        res.status(e.code ? e.code : 500).send({ "message": e.message ? e.message : "Something went wrong." });
    }
}

// API Controller to get all user task status and their counts.
export const getUserTasksAnalytics = async (req, res) => {
    try {
        const { projectId, userId } = req.params
        validateId("Project", projectId)
        validateId("TaskId", userId)
        const userTaskStatusCounts = await projectService.getUserTaskStatusCounts(projectId, userId);
        res.status(200).send(userTaskStatusCounts);
    } catch (e) {  
        console.log(e);
        res.status(e.code ? e.code : 500).send({ "message": e.message ? e.message : "Something went wrong." });
    }
}


// API Controller to create a new Task in a given project.
export const createTask = async (req, res) => {
    try {
        const { projectId } = req.params
        validateId("Project", projectId)
        let taskId = uuidv4()
        const validationString = validatePayload(req.body, ["taskName", "description", "dueDate", "taskStatus", "taskLabel", "taskCreatedBy", "taskAssignedTo", "lastModifiedBy"])
        if (!validationString.status) {
            throw ({ code: 400, message: validationString.message })
        }
        const project = await projectService.saveTaskToProject({ ...req.body, id: taskId, projectId: projectId });
        res.status(201).send(project);
    }
    catch (e) {
        console.log(e);
        res.status(e.code ? e.code : 500).send({ "message": e.message ? e.message : "Something went wrong." });
    }

}

// API Controller to delete a Task in a given project.
export const deleteTask = async (req, res) => {
    try {
        const { projectId, taskId } = req.params
        validateId("Project", projectId)
        validateId("Task", taskId)
        const deletedTask = await projectService.deleteTaskFromProject(projectId, taskId);
        if (deletedTask.deletedCount === 0) {
            throw ({ code: 404, message: `Entity doesn't exist with task id: ${taskId}` });
        }
        res.status(204).send({});
    } catch (e) {
        console.log(e);
        res.status(e.code ? e.code : 500).send({ "message": e.message ? e.message : "Something went wrong." });
    }

}

// API Controller to update a Task in a given project.
export const updateTask = async (req, res) => {

    try {
        const { projectId, taskId } = req.params
        validateId("Project", projectId)
        validateId("Task", taskId)
        const validationString = validatePayload(req.body, ["taskName", "taskLabel", "description", "dueDate", "taskStatus", "taskCreatedBy", "taskAssignedTo", "lastModifiedBy"])
        if (!validationString.status) {
            throw ({ code: 400, message: validationString.message })
        }

        const updatedTask = await projectService.modifySpecificFieldsInTask(projectId, taskId, req.body);
        if (!updatedTask) {
            throw ({ code: 404, message: `Entity doesn't exist with task id: ${taskId}` });
        }
        res.status(200).send(updatedTask);

    }
    catch (e) {
        console.log(e);
        res.status(e.code ? e.code : 500).send({ "message": e.message ? e.message : "Something went wrong." });
    }

}