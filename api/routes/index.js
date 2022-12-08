import ProjectRouter from './project-routes.js';
import UserRouter from './user-routes.js';

export default (app) => {
    app.use('/api/v1/projects', ProjectRouter);
    app.use('/api/v1/users', UserRouter);
}
