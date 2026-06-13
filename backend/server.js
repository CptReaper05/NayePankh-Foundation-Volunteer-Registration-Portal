const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// 1. LOAD ENV FIRST 
dotenv.config();


// 2. REQUIRE DATABASE LOGIC AFTER ENV IS LOADED
const connectDB = require('./config/db.js');

const app = express();

// 3. CONNECT TO ATLAS
connectDB();

app.use(cors({
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  preflightContinue: false,
  optionsSuccessStatus: 204,
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

const volunteerRoutes = require('./routes/volunteerRoutes');
const authRoutes = require('./routes/authRoutes'); // 1. Import it
const driveRoutes = require('./routes/driveRoutes');

app.use('/api/volunteers', volunteerRoutes)
app.use('/api/auth', authRoutes); // 2. Mount it
app.use('/api/drives', driveRoutes);

app.get('/', (req, res) => {
  res.send('NayePankh NGO API is running...');
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server spinning on port ${PORT}`));