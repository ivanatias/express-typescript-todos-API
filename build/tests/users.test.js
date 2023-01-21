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
    yield (0, helpers_1.saveUsersInDB)();
}));
describe('GET users', () => {
    test('users are returned as JSON', () => __awaiter(void 0, void 0, void 0, function* () {
        yield helpers_1.API.get('/api/users')
            .expect(200)
            .expect('Content-Type', /application\/json/);
    }));
});
describe('POST users', () => {
    test('is able to create a new user', () => __awaiter(void 0, void 0, void 0, function* () {
        const { body: newCreatedUser } = yield helpers_1.API.post('/api/users')
            .send(helpers_1.newUserInfo)
            .expect(201);
        const { body: users } = yield helpers_1.API.get('/api/users');
        const usersUsernames = (0, helpers_1.extractUsernames)(users);
        expect(users).toHaveLength(helpers_1.dummyUsers.length + 1);
        expect(usersUsernames).toContain(newCreatedUser.username);
    }));
    test('is not able to create a new user if one of the required fields is missing', () => __awaiter(void 0, void 0, void 0, function* () {
        yield helpers_1.API.post('/api/users').send(helpers_1.incompleteNewUserInfo).expect(400);
    }));
    test('is not able to create a new user if the username is already taken', () => __awaiter(void 0, void 0, void 0, function* () {
        const { username, name } = helpers_1.dummyUsers[0];
        const newUser = {
            username,
            password: 'pswd',
            name
        };
        const response = yield helpers_1.API.post('/api/users').send(newUser).expect(409);
        expect(response.text).toBe('This username already exists.');
        const { body: users } = yield helpers_1.API.get('/api/users');
        expect(users).toHaveLength(helpers_1.dummyUsers.length);
    }));
});
afterAll(() => {
    mongoose_1.default.connection.close();
    __1.server.close();
});
