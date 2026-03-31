const express = require('express');
const dotenv = require('dotenv');
// const cors = require('cors');

const connectDB = require('./config/db');

dotenv.config(); //loading env variables

connectDB();

const app = express(); //initialize express

app.get('/',(req,res)=>{
    res.send('CIRS running')
});

const PORT = process.env.PORT;

app.listen(PORT,()=>{
    console.log(`server started at: http://localhost:${PORT}`);
});

