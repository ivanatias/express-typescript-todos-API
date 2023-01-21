"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const { JWT_SECRET } = process.env;
exports.default = (req, _res, next) => {
    const auth = req.get('Authorization');
    let token = '';
    if (auth && auth.startsWith('Bearer')) {
        token = auth.substring(7);
    }
    const decodedToken = jsonwebtoken_1.default.verify(token, JWT_SECRET);
    const { id } = decodedToken;
    req.userId = id;
    next();
};
