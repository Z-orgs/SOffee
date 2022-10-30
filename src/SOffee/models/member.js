"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const member = new Schema({
    name: String,
    image: String,
    dob: Date || String,
    address: String,
    username: {
        type: String,
        unique: true,
    },
    password: String,
    star: Number,
    cart: [],
    tel: String,
}, {
    collection: 'Member',
});
const Member = mongoose_1.default.model('Member', member);
exports.default = Member;
