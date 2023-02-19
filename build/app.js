"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const mongo_1 = require("./mongo");
const todos_1 = __importDefault(require("./routes/todos"));
const users_1 = __importDefault(require("./routes/users"));
const login_1 = __importDefault(require("./routes/login"));
const not_found_1 = __importDefault(require("./middlewares/not-found"));
(0, mongo_1.connectDB)();
const app = (0, express_1.default)();
exports.app = app;
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.get('/', (_req, res) => {
    console.log('someone requested something at this endpoint!');
    res.json([
        {
            endpoint: '/api/todos',
            options: [
                {
                    method: 'GET',
                    parameters: [
                        {
                            name: 'all todos',
                            endpoint: '/',
                            description: 'Returns all todos from all users',
                            authentication: false
                        },
                        {
                            name: 'user todos',
                            endpoint: '/usertodos',
                            description: 'Returns all todos from a user',
                            authentication: true
                        },
                        {
                            name: 'todo',
                            endpoint: '/:id',
                            description: 'Returns a todo by its id',
                            authentication: false
                        }
                    ]
                },
                {
                    method: 'DELETE',
                    parameters: [
                        {
                            name: 'delete todo',
                            endpoint: '/:id',
                            description: 'Finds a todo by its id and deletes it',
                            authentication: true
                        }
                    ]
                },
                {
                    method: 'POST',
                    parameters: [
                        {
                            name: 'create todo',
                            endpoint: '/',
                            description: 'Creates and returns a new todo',
                            authentication: true
                        }
                    ]
                },
                {
                    method: 'PUT',
                    parameters: [
                        {
                            name: 'modify todo',
                            endpoint: '/:id',
                            description: 'Finds a todo by its id and modifies it',
                            authentication: true
                        }
                    ]
                }
            ]
        },
        {
            endpoint: '/api/users',
            options: [
                {
                    method: 'GET',
                    parameters: [
                        {
                            name: 'all users',
                            endpoint: '/',
                            description: 'Returns all users',
                            authentication: false
                        }
                    ]
                },
                {
                    method: 'POST',
                    parameters: [
                        {
                            name: 'create user',
                            endpoint: '/',
                            description: 'Creates and returns a new user',
                            authentication: false
                        }
                    ]
                }
            ]
        },
        {
            endpoint: '/api/login',
            options: [
                {
                    method: 'POST',
                    parameters: [
                        {
                            name: 'login',
                            endpoint: '/',
                            description: 'Logs in a user by providing a session token',
                            authentication: false
                        }
                    ]
                }
            ]
        }
    ]);
});
app.use('/api/todos', todos_1.default);
app.use('/api/users', users_1.default);
app.use('/api/login', login_1.default);
app.use(not_found_1.default);
