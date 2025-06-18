const services = require("../services/task_services");
import { Request, Response } from "express";
const { taskSchema } = require("../validator/task_validators");

const getTasks = async function (req: Request, res: Response) {
  try {
    const tasks = await services.getTasks();
    res.json({
      status: "success",
      data: tasks,
      meta: {
        count: tasks.length,
      },
    });
  } catch (err) {
    console.error("Error fetching tasks:", err);
    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
      error: err,
    });
  }
};
const createTask = async function (req: Request, res: Response) {
  const { error, value } = taskSchema.validate(req.body, {
    abortEarly: false,
  });
  if (error) {
    console.error("Validation error:", error.details);
    return res.status(400).json({ status: "error",
        message: "Validation Error",
        error: error.details, });
  }
  try {
    const task = req.body;
    const savedTask = await services.createTask(task);
     res.status(201).json({
        status: "success",
        message: "Task saved successfully",
        data: savedTask,
    });
  } catch (err) {
    console.error("Error saving task:", err);
    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
      error: err,
    });
  }
};
const getTaskById = async function (req: Request, res: Response) {
  try {
    const taskId = parseInt(req.params.id, 10);
    const task = await services.getTaskById(taskId);
    if (task) {
      res.json(task);
    } else {
      res.status(404).json({ status: "error", error: "Task not found" });
    }
  } catch (err) {
    console.error("Error fetching task:", err);
    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
      error: err,
    });
  }
};
const updateTaskbyId = async function (req: Request, res: Response) {
  const { error, value } = taskSchema.validate(req.body, {
    abortEarly: false,
  });
  if (error) {
    console.error("Validation error:", error.details);
    return res.status(400).json({ status: "error",
        message: "Validation Error",
        error: error.details, });
  }
  try {
    const taskId = parseInt(req.params.id, 10);
    const task = req.body;
    const updatedTask = await services.updateTaskbyId(taskId, task);
    if (updatedTask) {
      res.status(200).json({
        status: "success",
        message: "Task updated successfully",
        data: updatedTask,
    });
    } else {
      res.status(404).json({ status: "error", error: "Task not found" });
    }
  } catch (err) {
    console.error("Error updating task:", err);
    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
      error: err,
    });
  }
};
const deleteTaskById = async function (req: Request, res: Response) {
  try {
    const taskId = parseInt(req.params.id, 10);
    await services.deleteTaskById(taskId);
    res.status(200).json({
        status: "success",
        message: `Task of taskId ${taskId} deleted successfully`,
    });
  } catch (err) {
    console.error("Error deleting task:", err);
    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
      error: err,
    });
  }
};
const patchTaskAsCompleted = async function (req: Request, res: Response) {
  try {
    const taskId = parseInt(req.params.id, 10);
    const updatedTask = await services.patchTaskAsCompleted(taskId);
    if (updatedTask) {
      res.status(200).json({
        status: "success",
        message: `Task ${taskId} marked as complete`,
        data: updatedTask,
    });
    } else {
      res.status(404).json({ status: "error", error: "Task not found" });
    }
  } catch (err) {
    console.error("Error patching task as completed:", err);
    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
      error: err,
    });
  }
};
module.exports = {
  getTasks,
  createTask,
  getTaskById,
  updateTaskbyId,
  deleteTaskById,
  patchTaskAsCompleted,
};
