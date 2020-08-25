require("dotenv").config();
require("./config/dbConnection");
const express = require('express');
const app = express();
const path = require("path");
const logger = require("morgan");
const cookieParser = require('cookie-parser');
const session = require("express-session");
const mongoose = require('mongoose');
const cors = require("cors");
const MongoStore = require("connect-mongo")(session);

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
)

// const corsOptions = {
//   origin: process.env.FRONTEND_URL,
//   credentials: true
// };
// app.use(cors(corsOptions));

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));






app.use(
  session({
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    cookie: {sameSite:"Strict"},
  })
);
// const MongoClient = require('mongodb').MongoClient;
// const uri = process.env.MONGODB_URI;
// const client = new MongoClient(uri, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// });
// client.connect(err => {
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
//   client.close();
// });

const userRouter = require('./routes/User');
app.use('/user', userRouter);

const todoRouter = require('./routes/Todos');
app.use('/todo', todoRouter);


app.listen(process.env.PORT, () => {
  console.log('express server started 👌');
});

module.exports = app;