const express = require("express");
const todoRouter = express.Router();
const passport = require("passport");
const passportConfig = require("../passport");
const JWT = require("jsonwebtoken");
const User = require("../models/User");
const Todo = require("../models/Todo");
const SubTodo = require('../models/SubTodo');
const Comment = require('../models/Comment');
require("dotenv").config();



//GET ALL THE TODOS
todoRouter.get("/todos",
    (req, res, next) => {
        Todo
            .find()
            .populate('creator')
            .then((todoDocument) => {
                res.status(200).json(todoDocument);
            })
            .catch((error) => {
                res.status(500).json(error);
            })
    });


//GET ONE TODO   
todoRouter.get("/:id",
    (req, res) => {
        Todo
            .findById(req.params.id)
            .populate('creator')
            .then((todoDocument) => {
                console.log(todoDocument)
                res.status(200).json(todoDocument);
            })
            .catch((error) => {
                res.status(500).json(error);
            })

    })

//UPDATE ONE TODO   
todoRouter.patch("/:id",
    (req, res) => {
        Todo
            .findByIdAndUpdate(
                req.params.id, req.body, {
                    new: true
                })
            .then((document) => {
                res.status(200).json(document)
            })
            .catch((error) => {
                res.status(500).json(error)
            })
    })
//CREATE ONE TODO

todoRouter.post("/todo",
    (req, res) => {
        const creator = req.session.user._id;
        const {
            name,
            description
        } = req.body;
        const newTodo = new Todo({
            creator,
            name,
            description
        });
        newTodo
            .save()
            .then((todoDocument) => {
                res.status(201).json(todoDocument)
            })
            .catch((error) => {
                res.status(500).json(error)
            })
    });

//DELETE A TODO   
todoRouter.delete("/:id",
    (req, res) => {
        Todo
            .deleteOne({
                _id: req.params.id
            }, {
                new: true
            })
            .then((document) => {
                res.status(200).json(document)
            })
            .catch((error) => {
                res.status(500).json(error)
            })
    })


//POST A SUBTODO
todoRouter.post("/subTodo",
    (req, res) => {
        const {
            name,
            description,
            todoParent_id,
            workers
        } = req.body;
        const newsubTodo = new SubTodo({
            name,
            description,
            todoParent_id,
            workers
        });
        newsubTodo
            .save()
            .then((subTodoDocument) => {
                res.status(201).json(subTodoDocument)
            })
            .catch((error) => {
                res.status(500).json(error)
            })
    });


//GET ALL SUBTODOS
todoRouter.get("/subTodos/all",
(req,res,next)=>{
    SubTodo
        .find()
        .populate('todoParent_id')
        .populate('workers')
        .then((subTodoDocument)=>{
            res.status(200).json(subTodoDocument);
        })
        .catch((error)=>{
            res.status(500).json(error)
        })
}
)

// GET ONE SUBTODO   
todoRouter.get("/subTodos/:id",
    (req, res) => {
        SubTodo
            .findById(req.params.id)
            .populate('todoParent_id')
            .populate('workers')
            .then((subTodoDocument) => {
                res.status(200).json(subTodoDocument);
            })
            .catch((error) => {
                res.status(500).json(error);
            })
    });

//UPDATE ONE SUBTODO
todoRouter.patch("/subTodos/:id",
    (req, res) => {
        SubTodo
            .findByIdAndUpdate(
                req.params.id, req.body, {
                    new: true
                })
            .then((document) => {
                res.status(200).json(document)
            })
            .catch((error) => {
                res.status(500).json(error)
            })
    })

//DELETE ONE SUBTODO
todoRouter.delete("/subTodos/:id",
    (req, res) => {
        SubTodo
            .deleteOne({
                _id: req.params.id
            }, {
                new: true
            })
            .then((document) => {
                res.status(200).json(document)
            })
            .catch((error) => {
                res.status(500).json(error)
            })
    })

//DELETE SUBTODOS RELATED TO A PROJECT
todoRouter.delete("/subTodos/project/:id",
    (req, res) => {
        SubTodo
            .deleteMany({
                todoParent_id : req.params.id
            }, {
                new: true
            })
            .then((document) => {
                res.status(200).json(document)
            })
            .catch((error) => {
                res.status(500).json(error)
            })
    })    

//POST A COMMENT    
todoRouter.post("/comment",
    (req, res) => {
        const userRef = req.session.user._id;
        const {
            text,
            subTodoParent_id,
            toDoRef
        } = req.body;
        const newComment = new Comment({
            userRef,
            text,
            subTodoParent_id,
            toDoRef
        });
        newComment
            .save()
            .then((commentDocument) => {
                res.status(201).json(commentDocument)
            })
            .catch((error) => {
                res.status(500).json(error)
            })
    });

//GET ALL COMMENTS    
todoRouter.get("/comments/all",
    (req, res) => {
        Comment
            .find()
            .populate('userRef')
            .then((commentDocument) => {
                res.status(200).json(commentDocument);
            })
            .catch((error) => {
                res.status(500).json(error);
            })
    });

//GET ONE COMMENT
todoRouter.get("/comments/:id", 
    (req, res) => {
        Comment
            .findById(req.params.id)
            .populate('userRef')
            .populate('subTodoParent_id')
            .then((document) => {
                res.status(200).json(document);
            })
            .catch((error) => {
                res.status(500).json(error);
            })

    })

    

//DELETE A COMMENT   
todoRouter.delete("/comments/:id", 
    (req, res) => {
        Comment
            .deleteOne({
                _id: req.params.id
            }, {
                new: true
            })
            .then((document) => {
                res.status(200).json(document)
            })
            .catch((error) => {
                res.status(500).json(error)
            })
    })

//DELETE COMMENTS RELATED TO A SUBTODO
todoRouter.delete('/comments/subTodos/:id',
(req, res)=>{
    Comment
        .deleteMany({
            subTodoParent_id : req.params.id
        }, {
            new : true
        })
        .then((document)=>{
            res.status(200).json(document)
        })
        .catch((error)=>{
            res.status(500).json(error)
        })
})

//DELETE COMMENTS RELATED TO A PROJECT
todoRouter.delete('/comments/todo/:id',
(req, res)=>{
    Comment
        .deleteMany({
            toDoRef : req.params.id
        }, {
            new : true
        })
        .then((document)=>{
            res.status(200).json(document)
        })
        .catch((error)=>{
            res.status(500).json(error)
        })
})

module.exports = todoRouter;