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
const todo_1 = require("../models/todo");
const user_1 = require("../models/user");
const helpers_1 = require("./helpers");
beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
    yield todo_1.Todo.deleteMany({});
    yield user_1.User.deleteMany({});
    yield (0, helpers_1.saveTodosInDB)();
}));
describe('GET all todos', () => {
    test('the todos are returned as JSON', () => __awaiter(void 0, void 0, void 0, function* () {
        yield helpers_1.API.get('/api/todos')
            .expect(200)
            .expect('Content-Type', /application\/json/);
    }));
    test('there are four todos', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield helpers_1.API.get('/api/todos');
        expect(response.body).toHaveLength(helpers_1.dummyTodos.length);
    }));
    test('a logged in user can retrieve all his/her todos', () => __awaiter(void 0, void 0, void 0, function* () {
        const { name, username, passwordHash, _id } = helpers_1.userWithTodo;
        const token = yield (0, helpers_1.createAndLoginUser)(name, username, passwordHash, _id);
        yield helpers_1.API.get('/api/todos/usertodos')
            .set('Authorization', `Bearer ${token}`)
            .expect(200);
    }));
});
describe('GET a todo', () => {
    test('is able to retrieve the first todo providing a valid id', () => __awaiter(void 0, void 0, void 0, function* () {
        const firstTodo = yield todo_1.Todo.findOne({ title: helpers_1.dummyTodos[0].title });
        yield helpers_1.API.get(`/api/todos/${firstTodo === null || firstTodo === void 0 ? void 0 : firstTodo._id}`).expect(200);
    }));
    test('is not possible to retrieve a todo providing an invalid id', () => __awaiter(void 0, void 0, void 0, function* () {
        yield helpers_1.API.get('/api/todos/1234567890').expect(400);
    }));
    test('is not possible to retrieve a todo that does not exist providing a valid id', () => __awaiter(void 0, void 0, void 0, function* () {
        yield helpers_1.API.get(`/api/todos/${helpers_1.nonExistentTodoId}`).expect(404);
    }));
});
describe('DELETE todo', () => {
    test('a logged in user is able to delete his/her own todo', () => __awaiter(void 0, void 0, void 0, function* () {
        const { name, username, passwordHash, _id } = helpers_1.userWithTodo;
        const token = yield (0, helpers_1.createAndLoginUser)(name, username, passwordHash, _id);
        const todoToDelete = yield todo_1.Todo.findOne({
            title: 'This todo should be deleted'
        });
        yield helpers_1.API.delete(`/api/todos/${todoToDelete === null || todoToDelete === void 0 ? void 0 : todoToDelete._id}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(204);
        const response = yield helpers_1.API.get('/api/todos');
        expect(response.body).toHaveLength(helpers_1.dummyTodos.length - 1);
    }));
    test('a logged in user should not be able to delete a todo that he/she does not own', () => __awaiter(void 0, void 0, void 0, function* () {
        const { name, username, passwordHash } = helpers_1.userWithNoTodo;
        const token = yield (0, helpers_1.createAndLoginUser)(name, username, passwordHash);
        const todoToDelete = yield todo_1.Todo.findOne({
            title: 'This todo should not be deleted'
        });
        yield helpers_1.API.delete(`/api/todos/${todoToDelete === null || todoToDelete === void 0 ? void 0 : todoToDelete._id}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(401);
        const response = yield helpers_1.API.get('/api/todos');
        expect(response.body).toHaveLength(helpers_1.dummyTodos.length);
    }));
    test('not logged in user should get a 401', () => __awaiter(void 0, void 0, void 0, function* () {
        const todoToDelete = yield todo_1.Todo.findOne({
            title: 'This todo should not be deleted'
        });
        yield helpers_1.API.delete(`/api/todos/${todoToDelete === null || todoToDelete === void 0 ? void 0 : todoToDelete._id}`).expect(401);
    }));
});
describe('PUT todo', () => {
    test('a logged in user is able to update his/her own todo', () => __awaiter(void 0, void 0, void 0, function* () {
        const { name, username, passwordHash, _id } = helpers_1.userWithTodo;
        const token = yield (0, helpers_1.createAndLoginUser)(name, username, passwordHash, _id);
        const todoToUpdate = yield todo_1.Todo.findOne({
            title: 'This todo should be updated'
        });
        const newContent = {
            title: 'UPDATED!'
        };
        const response = yield helpers_1.API.put(`/api/todos/${todoToUpdate === null || todoToUpdate === void 0 ? void 0 : todoToUpdate._id}`)
            .set('Authorization', `Bearer ${token}`)
            .send(newContent)
            .expect(200);
        expect(response.body.title).toContain(newContent.title);
    }));
});
describe('POST todo', () => {
    test('a logged in user can create a new todo', () => __awaiter(void 0, void 0, void 0, function* () {
        const { name, username, passwordHash } = helpers_1.userWithNoTodo;
        const token = yield (0, helpers_1.createAndLoginUser)(name, username, passwordHash);
        const newTodo = {
            title: 'This is a fresh, new todo',
            isPriority: true
        };
        yield helpers_1.API.post('/api/todos')
            .set('Authorization', `Bearer ${token}`)
            .send(newTodo)
            .expect(200);
        const response = yield helpers_1.API.get('/api/todos');
        expect(response.body).toHaveLength(helpers_1.dummyTodos.length + 1);
    }));
    test('a logged in user can not create a new todo if one of the fields is invalid', () => __awaiter(void 0, void 0, void 0, function* () {
        const { name, username, passwordHash } = helpers_1.userWithNoTodo;
        const token = yield (0, helpers_1.createAndLoginUser)(name, username, passwordHash);
        const newTodo = {
            title: 'This is a fresh, new todo',
            isPriority: 'true'
        };
        yield helpers_1.API.post('/api/todos')
            .set('Authorization', `Bearer ${token}`)
            .send(newTodo)
            .expect(400);
    }));
});
afterAll(() => {
    mongoose_1.default.connection.close();
    __1.server.close();
});
