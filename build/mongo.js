"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const simple_validators_1 = require("./utils/simple-validators");
const dotenv_1 = __importDefault(require("dotenv"));
mongoose_1.default.set('strictQuery', true);
dotenv_1.default.config();
const { NODE_ENV, MONGODB_URI, MONGODB_URI_TEST } = process.env;
const VALID_MONGODB_URI = (0, simple_validators_1.assertNonNullable)(MONGODB_URI);
const VALID_MONGODB_URI_TEST = (0, simple_validators_1.assertNonNullable)(MONGODB_URI_TEST);
const connectionString = NODE_ENV === 'test' ? VALID_MONGODB_URI_TEST : VALID_MONGODB_URI;
const connectDB = () => {
    mongoose_1.default
        .connect(connectionString)
        .then(() => {
        console.log('Connected to Database');
    })
        .catch((error) => {
        console.error(error);
    });
};
exports.connectDB = connectDB;
