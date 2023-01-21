"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidTodo = void 0;
const simple_validators_1 = require("./simple-validators");
const isValidTodo = ({ title, isPriority }) => {
    return (0, simple_validators_1.isString)(title) && (0, simple_validators_1.isBoolean)(isPriority);
};
exports.isValidTodo = isValidTodo;
