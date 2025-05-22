import { app } from './app'
const port = process.env.PORT || 5500;

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});