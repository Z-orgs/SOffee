"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const admin_1 = __importDefault(require("./models/admin"));
const member_1 = __importDefault(require("./models/member"));
const guest_1 = __importDefault(require("./models/guest"));
const bill_1 = __importDefault(require("./models/bill"));
const product_1 = __importDefault(require("./models/product"));
const message_1 = __importDefault(require("./models/message"));
const SOffee = {
    Admin: admin_1.default,
    Member: member_1.default,
    Guest: guest_1.default,
    Bill: bill_1.default,
    Product: product_1.default,
    Message: message_1.default,
};
exports.default = SOffee;
