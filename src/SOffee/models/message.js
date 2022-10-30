"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const message = new Schema({
    username: String,
    email: String,
    subject: String,
    message: String,
    date: Date,
}, {
    collection: 'Message',
});
const Message = mongoose_1.default.model('Message', message);
exports.default = Message;
