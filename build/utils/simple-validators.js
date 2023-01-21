"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assertNonNullable = exports.isDate = exports.isBoolean = exports.isNumber = exports.isString = void 0;
const isString = (string) => {
    return typeof string === 'string';
};
exports.isString = isString;
const isNumber = (number) => {
    return typeof number === 'number';
};
exports.isNumber = isNumber;
const isBoolean = (boolean) => {
    return typeof boolean === 'boolean';
};
exports.isBoolean = isBoolean;
const isDate = (date) => {
    return Boolean(Date.parse(date));
};
exports.isDate = isDate;
const assertNonNullable = (value) => {
    if (value === null || value === undefined) {
        throw new Error(`Variable cannot be ${String(value)}`);
    }
    return value;
};
exports.assertNonNullable = assertNonNullable;
