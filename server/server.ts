import express from 'express';
import { PrismaClient } from './prisma/generated/prisma';

const app = express();
const port = 3000;

// Middleware
app.use(express.json());

// Initialize Prisma Client
const prisma = new PrismaClient();


// Example route
app.get('/', async (req, res) => {
  const users = await prisma.user.findMany()
  res.json(users);
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});