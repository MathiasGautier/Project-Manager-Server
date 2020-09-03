const mongoose = require("mongoose");

const SubTodoSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ["To Do", "In Progress", "Done"],
        default: "To Do",
    },
    todoParent_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Todo",
    },
    workers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }]
});


module.exports = mongoose.model('SubTodo', SubTodoSchema);