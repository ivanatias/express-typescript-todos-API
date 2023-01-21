"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const todo_1 = require("../models/todo");
const user_1 = require("../models/user");
const check_todo_info_1 = require("../utils/check-todo-info");
const user_extractor_1 = __importDefault(require("../middlewares/user-extractor"));
const todo_ownership_1 = __importDefault(require("../middlewares/todo-ownership"));
const not_found_1 = __importDefault(require("../middlewares/not-found"));
const handle_errors_1 = __importDefault(require("../middlewares/handle-errors"));
const router = express_1.default.Router();
const todosUserInfoReturned = {
    username: 1,
    name: 1
};
router.get('/', (_req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const todos = yield todo_1.Todo.find({}).populate('user', todosUserInfoReturned);
        res.json(todos);
    }
    catch (err) {
        next(err);
    }
}));
router.get('/usertodos', user_extractor_1.default, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req;
    try {
        const user = yield user_1.User.findById(userId).populate('todos');
        res.json(user === null || user === void 0 ? void 0 : user.todos);
    }
    catch (err) {
        next(err);
    }
}));
router.get('/:id', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const foundTodo = yield todo_1.Todo.findById(id).populate('user', todosUserInfoReturned);
        if (!foundTodo)
            return res.status(404).end();
        res.json(foundTodo);
    }
    catch (err) {
        next(err);
    }
}));
router.delete('/:id', user_extractor_1.default, todo_ownership_1.default, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.method !== 'DELETE')
        return res.status(405).end();
    const { id } = req.params;
    try {
        yield todo_1.Todo.findByIdAndDelete(id);
        res.status(204).end();
    }
    catch (err) {
        next(err);
    }
}));
router.post('/', user_extractor_1.default, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.method !== 'POST')
        return res.status(405).end();
    const { title, isPriority } = req.body;
    const { userId } = req;
    const user = yield user_1.User.findById(userId);
    if (!title) {
        return res.status(400).send('Todo title must be specified');
    }
    if (!(0, check_todo_info_1.isValidTodo)({ title, isPriority })) {
        return res
            .status(400)
            .send('Invalid Todo format. Todo title must be of type string and Todo priority must be of type boolean.');
    }
    const newTodoToAdd = new todo_1.Todo({
        isCompleted: false,
        date: Date.now(),
        title,
        isPriority,
        user: user === null || user === void 0 ? void 0 : user.id
    });
    try {
        const savedTodo = yield newTodoToAdd.save();
        user === null || user === void 0 ? void 0 : user.todos.push(savedTodo._id);
        yield (user === null || user === void 0 ? void 0 : user.save());
        res.json(savedTodo);
    }
    catch (err) {
        next(err);
    }
}));
router.put('/:id', user_extractor_1.default, todo_ownership_1.default, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.method !== 'PUT')
        return res.status(405).end();
    const { id } = req.params;
    const { title, isPriority, isCompleted } = req.body;
    if (!title) {
        return res.status(400).send('Todo title must be specified');
    }
    const newTodoContent = {
        title,
        isPriority,
        isCompleted
    };
    try {
        const updatedTodo = yield todo_1.Todo.findByIdAndUpdate(id, newTodoContent, {
            new: true
        });
        res.json(updatedTodo);
    }
    catch (err) {
        next(err);
    }
}));
router.use(not_found_1.default);
router.use(handle_errors_1.default);
exports.default = router;
