import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import cookieParser from 'cookie-parser';

import apiRoutes from './routes/apiRoutes';
import logger from './middleware/logger';

// Load environment variables
const environment = process.argv[2] || 'dev';
console.log(`Environment: ${environment}`);
const envFile = environment === 'dev' ? '.env.dev' : '.env.prod';
dotenv.config({ path: envFile });

// Create app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
if (environment === 'dev') {
  app.use(
    cors({
      origin: 'http://localhost:3000',
      credentials: true,
    })
  );
} else {
  app.use(cors());
}
app.use(express.json());
app.use(cookieParser());
app.use(logger);

// Routes
app.use('/api', apiRoutes);

app.get('/', (req, res) => {
  res.send('Autohub');
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
