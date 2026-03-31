const express = require('express');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const issueRoutes = require('./routes/issueRoutes');
// const cors = require('cors');
const connectDB = require('./config/db');

dotenv.config(); //loading env variables
connectDB();

const app = express(); //initialize express
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/issues', issueRoutes);

app.get('/',(req,res)=>{
    res.send('CIRS running')
});

const PORT = process.env.PORT;

app.listen(PORT,()=>{
    console.log(`Server started at: http://localhost:${PORT}`);
});

