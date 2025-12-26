import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './modules/auth/auth.route.js';
import dataRoutes from './modules/dashboard/data.route.js';
import inquiryRoutes from './modules/inquiry/inquiry.route.js';
import sequelize from './config/db.config.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';

dotenv.config();


const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"], // frontend (supports both ports)
    credentials: true,               // allow cookies
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/auth' , authRoutes);
app.use('/api/' , dataRoutes ); // csv upload 
app.use('/api/inquiry', inquiryRoutes);


// Start server after DB connection
const PORT = process.env.PORT || 5000;

sequelize.authenticate()
  .then(() => {
    console.log('Database connected successfully');
   return sequelize.sync({ force: true, alter: false }); // disable automatic alterations in prod
 // optionally use { alter: true } in dev
  })
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.error('Database connection error:', err));
