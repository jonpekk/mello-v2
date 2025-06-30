import cookieParser from 'cookie-parser';
import express from 'express';
import authRoutes from './routes/authRoutes';
import counterRoutes from './routes/counterRoutes';
import userRoutes from './routes/userRoutes';

export const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());

app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/counter', counterRoutes)
