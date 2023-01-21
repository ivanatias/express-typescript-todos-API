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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_1 = require("../models/user");
const not_found_1 = __importDefault(require("../middlewares/not-found"));
const handle_errors_1 = __importDefault(require("../middlewares/handle-errors"));
const router = express_1.default.Router();
const { JWT_SECRET } = process.env;
router.post('/', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.method !== 'POST')
        return res.status(405).end();
    const { username, password } = req.body;
    try {
        const user = yield user_1.User.findOne({ username });
        const isPasswordCorrect = !user
            ? false
            : yield bcrypt_1.default.compare(password, user.passwordHash);
        if (!isPasswordCorrect || !user) {
            return res.status(409).send('Invalid username or password');
        }
        const userDataForToken = {
            username: user.username,
            id: user._id
        };
        const tokenForUser = jsonwebtoken_1.default.sign(userDataForToken, JWT_SECRET, {
            expiresIn: '5d'
        });
        res.send({
            username: user.username,
            name: user.name,
            token: tokenForUser
        });
    }
    catch (err) {
        next(err);
    }
}));
router.use(not_found_1.default);
router.use(handle_errors_1.default);
exports.default = router;
