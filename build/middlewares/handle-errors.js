"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MONGO_ERRORS = {
    userAlreadyExists: 'E11000'
};
const ERROR_HANDLERS = {
    CastError: (res) => res.status(400).send('The ID of the Todo is invalid.'),
    MongoServerError: (res, error) => {
        error.message.includes(MONGO_ERRORS.userAlreadyExists)
            ? res.status(409).send('This username already exists.')
            : res.status(500).end();
    },
    JsonWebTokenError: (res) => res.status(401).send('The authorization token is missing or is invalid.'),
    TokenExpiredError: (res) => res.status(401).send('The authorization token has expired.'),
    defaultError: (res, error) => {
        console.error(error);
        res.status(500).end();
    }
};
exports.default = (error, _req, res, _next) => {
    const handler = ERROR_HANDLERS[error.name] || ERROR_HANDLERS.defaultError;
    handler(res, error);
};
