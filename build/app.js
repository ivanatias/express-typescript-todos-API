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
    res.send('<h1>Todos API -> Node.js + Express.js + MongoDB + TypeScript</h1>');
});
app.use('/api/todos', todos_1.default);
app.use('/api/users', users_1.default);
app.use('/api/login', login_1.default);
app.use(not_found_1.default);
