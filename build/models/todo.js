"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Todo = void 0;
const mongoose_1 = require("mongoose");
const todoSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    date: { type: Date, required: true },
    isPriority: { type: Boolean, required: true },
    isCompleted: { type: Boolean, required: true },
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User'
    }
});
todoSchema.set('toJSON', {
    transform: (_document, returnedObject) => {
        returnedObject.id = returnedObject._id;
        delete returnedObject._id;
        delete returnedObject.__v;
    }
});
exports.Todo = (0, mongoose_1.model)('Todo', todoSchema);
