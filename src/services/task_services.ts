import {DataSource, ObjectLiteral} from 'typeorm';
const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: true,
    logging: true,
    entities: ["src/entities/*{.ts,.js}"],
});

dataSource.initialize()
    .then(() => {
        console.log('Database connected Successfully!');
    })
    .catch((err) => {
        console.error('Error during Database connection:', err)});

const getTasks = async (): Promise<ObjectLiteral[]> => {
    try {
        const tasks = await dataSource.getRepository('Task').find();
        return tasks;
    } catch (err) {
        console.error('Error fetching tasks:', err);
        throw new Error('Internal Server Error');
    }
};
const createTask  = async (task: ObjectLiteral): Promise<ObjectLiteral> => {
    try {
        const newTask = dataSource.getRepository('Task').create(task);
        const savedTask = await dataSource.getRepository('Task').save(newTask);
        return savedTask;
    } catch (err) {
        console.error('Error saving task:', err);
        throw new Error('Internal Server Error');
    }
};
const getTaskById = async (taskId: number): Promise<ObjectLiteral | null> => {
    try {
        const task = await dataSource.getRepository('Task').findOneBy({ id: taskId });
        return task;
    } catch (err) {
        console.error('Error fetching task:', err);
        throw new Error('Internal Server Error');
    }
};
const updateTaskbyId = async (taskId: number, task: ObjectLiteral): Promise<ObjectLiteral | null> => {
    try {
        const existingTask = await dataSource.getRepository('Task').findOneBy({ id: taskId });
        if (!existingTask) {
            return null; // Task not found
        }
        const updatedTask = await dataSource.getRepository('Task').save({ ...existingTask, ...task });
        return updatedTask;
    } catch (err) {
        console.error('Error updating task:', err);
        throw new Error('Internal Server Error');
    }
};
const deleteTaskById = async (taskId: number): Promise<void> => {
    try {
        const result = await dataSource.getRepository('Task').delete(taskId);
        if (result.affected === 0) {
            throw new Error('Task not found');
        }
    } catch (err) {
        console.error('Error deleting task:', err);
        throw new Error('Internal Server Error');
    }
}
const patchTaskAsCompleted = async (taskId: number): Promise<ObjectLiteral | null> => {
    try {
        const task = await dataSource.getRepository('Task').findOneBy({ id: taskId });
        if (!task) {
            return null; 
        }
        task.completed = true; 
        const updatedTask = await dataSource.getRepository('Task').save(task);
        return updatedTask;
    } catch (err) {
        console.error('Error patching task as completed:', err);
        throw new Error('Internal Server Error');
    }
}
export {
    dataSource,
    getTasks,
    createTask,
    getTaskById,
    updateTaskbyId,
    deleteTaskById,
    patchTaskAsCompleted
};


