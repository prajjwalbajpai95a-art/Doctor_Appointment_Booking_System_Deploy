const express = require('express');
const colors = require('colors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const cors = require('cors'); // CORS import karna zaroori hai alag folders ke liye
const connectDB = require('./config/db');

// config env (Root folder se .env load karne ke liye)
dotenv.config();

// mongodb connection
connectDB();

// rest object
const app = express();

// middlewares & CORS
app.use(cors()); // Frontend ko allow karne ke liye
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(morgan('dev'));

// routes
app.use('/api/v1/user', require('./routes/userRoutes'));
app.use('/api/v1/admin', require('./routes/adminRoutes'));
app.use('/api/v1/doctor', require('./routes/doctorRoutes'));

// PORT
const PORT = process.env.PORT || 8080;

// Listen Port
app.listen(PORT, () => {
    console.log(`Server is Running in ${process.env.NODE_MODE || 'development'} mode on port ${PORT}`.bgCyan.white);
});