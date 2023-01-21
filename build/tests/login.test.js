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
const mongoose_1 = __importDefault(require("mongoose"));
const __1 = require("..");
const user_1 = require("../models/user");
const helpers_1 = require("./helpers");
beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
    yield user_1.User.deleteMany({});
    yield helpers_1.API.post('/api/users').send(helpers_1.newUserInfo);
}));
describe('POST login', () => {
    test('an existing user is able to log in if correct password is provided', () => __awaiter(void 0, void 0, void 0, function* () {
        const credentials = {
            username: helpers_1.newUserInfo.username,
            password: helpers_1.newUserInfo.password
        };
        yield helpers_1.API.post('/api/login').send(credentials).expect(200);
    }));
    test('an existing user is not able to log in if incorrect password is provided', () => __awaiter(void 0, void 0, void 0, function* () {
        const credentials = {
            username: helpers_1.newUserInfo.username,
            password: 'incorrectpassword'
        };
        yield helpers_1.API.post('/api/login').send(credentials).expect(409);
    }));
    test('non existent user is not able to log in', () => __awaiter(void 0, void 0, void 0, function* () {
        const credentials = {
            username: helpers_1.incompleteNewUserInfo.username,
            password: helpers_1.incompleteNewUserInfo.password
        };
        yield helpers_1.API.post('/api/login').send(credentials).expect(409);
    }));
});
afterAll(() => {
    mongoose_1.default.connection.close();
    __1.server.close();
});
