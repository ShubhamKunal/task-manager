import {DataSource, ObjectLiteral} from 'typeorm';
import { Request, Response } from 'express';
var jwt = require('jsonwebtoken');
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

const getUsersExceptPassword = async (): Promise<ObjectLiteral[]> => {
    try {
        const users = await dataSource.getRepository('User').find({
            select: ['id', 'name', 'age', 'gender', 'email']
        });
        return users;
    } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
    }
}; 

const getUserById = async (id: number): Promise<ObjectLiteral | null> => {
    try {
        const user = await dataSource.getRepository('User').findOne({
            where: { id },
            select: ['id', 'name', 'age', 'gender', 'email']
        });
        return user || null;
    } catch (error) {
        console.error('Error fetching user by ID:', error);
        throw error;
    }
};

const registerUser = async (userData: ObjectLiteral): Promise<ObjectLiteral> => {
    try {
        const user = dataSource.getRepository('User').create(userData);
        const savedUser = await dataSource.getRepository('User').save(user);
        return savedUser;
    } catch (error) {
        console.error('Error registering user:', error);
        throw error;
    }
};

const signInUserAndGetJwt = async (email: string, password: string): Promise<string | null> => {
    try {
        const user = await dataSource.getRepository('User').findOne({
            where: { email, password }
        });
        if (user) {
            const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET , {
                expiresIn: '1h'
            });
            console.log('User signed in successfully:', user);
            console.log('Generated JWT:', token);
            return token;
        }
        return null;
    } catch (error) {
        console.error('Error signing in user:', error);
        throw error;
    }
};

const getLoggedInUserByHeader = async (req: Request, res: Response): Promise<ObjectLiteral | null> => {
    const authHeader = req.headers['authorization'];
    if (!authHeader || typeof authHeader !== 'string' || !authHeader.startsWith('Bearer ')) {
        return null; 
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = (decoded as any).id;
        const user = await dataSource.getRepository('User').findOne({
            where: { id: userId },
            select: ['id', 'name', 'age', 'gender', 'email']});
            return user || null;
    } catch (error) {
        console.error('Error verifying JWT:', error);
        return null; 
    }
};
const getLoggedInUserIdByHeader = async (req: Request): Promise<number | null> => {
    const authHeader = req.headers['authorization'];
    if (!authHeader || typeof authHeader !== 'string' || !authHeader.startsWith('Bearer ')) {
        return null;
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = (decoded as any).id;
        return userId;} catch (error) {
        console.error('Error verifying JWT:', error);
        return null;
    }
};
    


module.exports = {
    getUsersExceptPassword,
    getUserById,
    registerUser,
    signInUserAndGetJwt,
    getLoggedInUserByHeader,
    getLoggedInUserIdByHeader
};