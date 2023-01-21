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
exports.nonExistentTodoId = exports.extractUsernames = exports.createAndLoginUser = exports.saveUsersInDB = exports.saveTodosInDB = exports.dummyUsers = exports.dummyTodos = exports.incompleteNewUserInfo = exports.newUserInfo = exports.userWithNoTodo = exports.userWithTodo = exports.API = void 0;
const app_1 = require("../app");
const supertest_1 = __importDefault(require("supertest"));
const mongoose_1 = require("mongoose");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_1 = require("../models/user");
const todo_1 = require("../models/todo");
const { JWT_SECRET } = process.env;
const API = (0, supertest_1.default)(app_1.app);
exports.API = API;
const newUserInfo = {
    username: 'newuser',
    name: 'New User',
    password: 'password'
};
exports.newUserInfo = newUserInfo;
const incompleteNewUserInfo = {
    username: 'invalidnewuser',
    password: 'invalidpassword'
};
exports.incompleteNewUserInfo = incompleteNewUserInfo;
const userWithNoTodo = {
    name: 'User with no todo',
    username: 'userwithnotodo',
    passwordHash: 'test'
};
exports.userWithNoTodo = userWithNoTodo;
const userWithTodo = {
    name: 'User with todo',
    username: 'userwithtodo',
    passwordHash: 'test',
    _id: new mongoose_1.Types.ObjectId()
};
exports.userWithTodo = userWithTodo;
const dummyTodos = [
    {
        title: 'This is the first dummy todo',
        isPriority: true,
        isCompleted: false,
        date: new Date()
    },
    {
        title: 'This todo should be deleted',
        isPriority: true,
        isCompleted: false,
        date: new Date(),
        user: userWithTodo._id
    },
    {
        title: 'This todo should be updated',
        isPriority: true,
        isCompleted: false,
        date: new Date(),
        user: userWithTodo._id
    },
    {
        title: 'This todo should not be deleted',
        isPriority: true,
        isCompleted: false,
        date: new Date(),
        user: userWithTodo._id
    }
];
exports.dummyTodos = dummyTodos;
const dummyUsers = [userWithTodo, userWithNoTodo];
exports.dummyUsers = dummyUsers;
const nonExistentTodoId = new mongoose_1.Types.ObjectId();
exports.nonExistentTodoId = nonExistentTodoId;
const saveTodosInDB = () => __awaiter(void 0, void 0, void 0, function* () {
    for (const todo of dummyTodos) {
        const todoObject = new todo_1.Todo(todo);
        yield todoObject.save();
    }
});
exports.saveTodosInDB = saveTodosInDB;
const saveUsersInDB = () => __awaiter(void 0, void 0, void 0, function* () {
    for (const user of dummyUsers) {
        const userObject = new user_1.User(user);
        yield userObject.save();
    }
});
exports.saveUsersInDB = saveUsersInDB;
const createAndLoginUser = (name, username, password, id) => __awaiter(void 0, void 0, void 0, function* () {
    const newUser = new user_1.User({
        name,
        username,
        passwordHash: password,
        _id: id
    });
    yield newUser.save();
    const userDataForToken = {
        username: newUser.username,
        id: newUser._id
    };
    const token = jsonwebtoken_1.default.sign(userDataForToken, JWT_SECRET);
    return token;
});
exports.createAndLoginUser = createAndLoginUser;
const extractUsernames = (users) => {
    return users.map((user) => user.username);
};
exports.extractUsernames = extractUsernames;
