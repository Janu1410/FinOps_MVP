import express from 'express';
import dotenv from 'dotenv';
import clientRoutes from './modules/client/client.route.js';
import userRoutes from './modules/user/user.route.js';
import authRoutes from './modules/auth/auth.route.js';
import dataRoutes from './modules/dashboard/data.route.js';
import inquiryRoutes from './modules/inquiry/inquiry.route.js';
import sequelize from './config/db.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';

dotenv.config();


const app = express();

app.use(
  cors({
    origin: "http://localhost:5173", // frontend
    credentials: true,               // allow cookies
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/clients', clientRoutes);
app.use('/api/users', userRoutes);
app.use('/api/auth' , authRoutes);
app.use('/api/' , dataRoutes ); // csv upload 
app.use('/api/inquiry', inquiryRoutes);


// import { calendar, calendarId } from "./config/calender.js";

// async function testCalendar() {
//   const res = await calendar.events.list({
//     calendarId,
//     maxResults: 5,
//   });
//   console.log(res);
// }

// testCalendar();


// Start server after DB connection
const PORT = process.env.PORT || 5000;

sequelize.authenticate()
  .then(() => {
    console.log('Database connected successfully');
    return sequelize.sync(); // optionally use { alter: true } in dev
  })
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.error('Database connection error:', err));
