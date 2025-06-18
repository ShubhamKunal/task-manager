import express from "express";
const taskController = require("../controllers/task_controller");
const { authenticateJWT } = require("../middleware/check_auth");  

const taskRouter = express.Router();

taskRouter.get('/', authenticateJWT, taskController.getTasks);
taskRouter.post('/', authenticateJWT, taskController.createTask);
taskRouter.get('/:id', authenticateJWT, taskController.getTaskById);
taskRouter.put('/:id', authenticateJWT, taskController.updateTaskbyId);
taskRouter.delete('/:id', authenticateJWT, taskController.deleteTaskById);
taskRouter.patch('/:id/complete', authenticateJWT, taskController.patchTaskAsCompleted);

module.exports = taskRouter;
