const express = require("express");
const todoRouter = express.Router();
const passport = require("passport");
const passportConfig = require("../passport");
const JWT = require("jsonwebtoken");
const User = require("../models/User");
const Todo = require("../models/Todo");
const SubTodo = require('../models/SubTodo');
require("dotenv").config();


todoRouter.get("/todos", passport.authenticate("jwt", {
        session: false
    }),
    (req, res) => {
        User.findById({
            _id: req.user._id
        }).populate('todos').exec((err, document) => {
            if (err)
                res.status(500).json({
                    message: {
                        msgBody: "Error has occured",
                        msgError: true
                    }
                });
            else {
                res.status(200).json({
                    todos: document.todos,
                    authenticated: true
                });
            }
        });
    });

todoRouter.post("/todo", passport.authenticate("jwt", {
        session: false
    }),
    (req, res) => {
        const todo = new Todo(req.body);
        todo.save(err => {
            if (err)
                res.status(500).json({
                    message: {
                        msgBody: "Error has occured",
                        msgError: true
                    }
                });
            else {
                req.user.todos.push(todo);
                req.user.save(err => {
                    if (err)
                        res.status(500).json({
                            message: {
                                msgBody: "Error has occured",
                                msgError: true
                            }
                        });
                    else
                        res.status(200).json({
                            message: {
                                msgBody: "Successfully created task",
                                msgError: false
                            }
                        });
                });
            };
        });
    });



todoRouter.post("/subTodo", passport.authenticate("jwt", {
        session: false
    }),
    (req, res) => {
        const subTodo = new SubTodo(req.body);
        subTodo.save(err => {
            if (err)
                res.status(500).json({
                    message: {
                        msgBody: "Error has occured",
                        msgError: true
                    }
                });
            else {
                req.user.subTodos.push(subTodo);
                console.log(req.body)
                req.user.save(err => {
                    if (err)
                        res.status(500).json({
                            message: {
                                msgBody: "Error has occured",
                                msgError: true
                            }
                        });
                    else
                        res.status(200).json({
                            message: {
                                msgBody: "Successfully created sub task",
                                msgError: false
                            }
                        });
                });
            };
        });
    });

todoRouter.get("/subTodos", passport.authenticate("jwt", {
        session: false
    }),
    (req, res) => {
        User.findById({
            _id: req.user._id
        }).populate('subTodos').exec((err, document) => {
            if (err)
                res.status(500).json({
                    message: {
                        msgBody: "Error has occured",
                        msgError: true
                    }
                });
            else {
                res.status(200).json({
                    subTodos: document.subTodos,
                    authenticated: true
                });
            }
        });
    });

module.exports = todoRouter;