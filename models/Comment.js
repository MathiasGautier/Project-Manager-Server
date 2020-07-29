const mongoose = require("mongoose");
const CommentSchema = new mongoose.Schema({
    userRef:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    text :{
        type: String,
        required:true
    },
    subTodoParent_id: {
        type : mongoose.Schema.Types.ObjectId,
        ref:"Subtodo"
    },
    toDoRef: {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Todo"
    }
});

module.exports = mongoose.model('Comment', CommentSchema);
