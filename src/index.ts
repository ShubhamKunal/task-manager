import "reflect-metadata"
import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
const cors = require("cors");
const app = express();
app.use(express.json());
app.use(cors());
const PORT = process.env.PORT || 4000;
const taskRouter = require("./routes/task_routes");
const userRouter = require("./routes/user_routes");
const authRouter = require("./routes/auth_routes");


app.use("/tasks", taskRouter);
app.use("/auth", authRouter);
app.use("/users", userRouter);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
