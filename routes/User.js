const express = require("express");
const userRouter = express.Router();
const bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken");
const User = require("../models/User");
const Todo = require("../models/Todo");
require("dotenv").config();
const StatsD = require ('hot-shots');
const logger = require("../logger");
const dogstatsd = new StatsD();


const salt = 10;

userRouter.post("/register", (req, res) => {
    const {
        username,
        password
    } = req.body;
    User.findOne({
        username,
    }).then((userDocument) => {
        if (userDocument) {
            return res.status(400).json({
                message: "Username already taken",
            });
        }
        const hashedPassword = bcrypt.hashSync(password, salt);
        const newUser = {
            username,
            password: hashedPassword,
        }
        User.create(newUser)
            .then((user) => {
                const userObj = user.toObject();
                delete userObj.password;
                req.session.user = userObj;
                res.status(200).json(userObj)
                dogstatsd.increment('app.new.user') // NOTIFY ME WHEN A NEW USER IS CREATED

            })

            .catch((error) => {
                console.log("ici", error), res.status(500).json(error)
            })
    }).catch((error) => {
        res,
        status(500).json,
        console.log(error)
    })
})



userRouter.post("/login", (req, res, next) => {
    const {
        username,
        password,
    } = req.body;
    User.findOne({
            username,
        })
        .then((userDocument) => {
            if (!userDocument) {
                
                dogstatsd.increment('app.signin.fail')
                return res.status(400).json({
                    message: "Invalid credentials"
                }
                );
            }
            const isValidPassword = bcrypt.compareSync(
                password,
                userDocument.password
            );
            if (!isValidPassword) {
                dogstatsd.increment('app.signin.failed')
                return res.status(400).json({
                    message: "Invalid credentials",
                });
            }
            dogstatsd.increment('app.signin.success')
            const userObj = userDocument.toObject();
            delete userObj.password;
            logger.info(userObj);
            
            req.session.user = userObj;
            res.status(200).json(userObj);
        })
        .catch((error) => {
            console.log(error)
        })
});

userRouter.get("/admin",
    (req, res) => {
        if (req.user.role === 'admin') {
            res.status(200).json({
                message: {
                    msgBody: 'You are an admin',
                    msgError: false
                }
            });
        } else
            res.status(403).json({
                message: {
                    msgBody: "You're not an admin",
                    msgError: true
                }
            })
    });

userRouter.get("/authenticated",
    (req, res) => {
        if (req.session.user) {
            const {
                username,
                role,
                _id
            } = req.session.user;
            res.status(200).json({
                isAuthenticated: true,
                user: {
                    username,
                    role,
                    _id
                }
            });
            console.log(req.session.user)
        } else {
            res.status(401).json({
                message: "Unauthorized"
            })
        }
    });

userRouter.get('/users',
    (req, res) => {
        User
            .find()
            .then((userDocument) => {
                res.status(200).json(userDocument);
            })
            .catch((error) => {
                res.status(500).json(error);
            })
    }
);

userRouter.get("/logout", (req, res, next) => {
  req.session.destroy(function (error) {
    if (error) res.status(500).json(error);
    else
      res.status(200).json({
        message: "Succesfully disconnected.",
      });
  });
});


module.exports = userRouter;