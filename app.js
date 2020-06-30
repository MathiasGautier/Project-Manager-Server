require("dotenv").config();
const express = require('express');
const app = express();
const path = require("path");
const logger = require("morgan");
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const cors = require("cors");

app.use(
    cors({
      origin : process.env.FRONTEND_URL,
      credentials:true,
    })
  )

app.use(logger("dev")); 
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));


mongoose.connect(process.env.MONGODB_URI, {useNewUrlParser:true,  useUnifiedTopology: true}, ()=>{
    console.log('successfully connected to database👀');
});

const userRouter = require('./routes/User');
app.use('/user', userRouter);

const todoRouter = require('./routes/Todos');
app.use('/todo', todoRouter);


app.listen(process.env.PORT, ()=>{
    console.log('express server started 👌');
});