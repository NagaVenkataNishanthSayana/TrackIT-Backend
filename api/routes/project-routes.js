import express from 'express';
import * as ProjectController from './../controllers/project-controller.js';

const ProjectRouter = express.Router();

// Register all ProjectController routes : CRUD operations.
ProjectRouter.route('/').get(ProjectController.getAllProjects);
ProjectRouter.route('/').post(ProjectController.createProject);
ProjectRouter.route('/:projectId').put(ProjectController.updateProject);
ProjectRouter.route('/:projectId').delete(ProjectController.deleteProjectById);
ProjectRouter.route('/:projectId').get(ProjectController.getAdminById);

// User-Project routes
ProjectRouter.route('/:projectId/users').get(ProjectController.getAllUsersByProjectId);
ProjectRouter.route('/:projectId/users/:userId').delete(ProjectController.removeUserFromProject);
ProjectRouter.route('/:projectId/users/:userId').get(ProjectController.getAllUserTasksByProjectId);
ProjectRouter.route('/:projectId/users/:userId/tasks/analytics').get(ProjectController.getUserTasksAnalytics);

// User-Task routes
ProjectRouter.route('/:projectId/tasks').get(ProjectController.getAllTasksByProjectId);
ProjectRouter.route('/:projectId/tasks/analytics/').get(ProjectController.getTasksAnalytics);
ProjectRouter.route('/:projectId/tasks').post(ProjectController.createTask);
ProjectRouter.route('/:projectId/tasks/:taskId').put(ProjectController.updateTask);
ProjectRouter.route('/:projectId/tasks/:taskId').delete(ProjectController.deleteTask);

export default ProjectRouter;
