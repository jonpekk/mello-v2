import express from 'express';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes';
import { authenticate } from './middleware/auth';
import cookieParser from 'cookie-parser';
import counterRoutes from './routes/counterRoutes';

dotenv.config();

export const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());


// Example route
app.get('/', async (req, res) => {
  res.json({ test: 'sent' });
});

app.use('/api/v1/users', userRoutes);
app.use('/api/v1/counter', counterRoutes)

app.get('/api/v1/profile', authenticate, (req, res) => {
  res.json({ auth: 'BOOM' })
});
