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
exports.requireUsername = exports.requireLogin = void 0;
const SOffee_1 = __importDefault(require("../SOffee"));
function requireLogin(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const [member, guest] = yield Promise.all([
            SOffee_1.default.Member.find({ username: req.signedCookies.username }),
            SOffee_1.default.Guest.find({ username: req.signedCookies.username }),
        ]);
        if (member.length == 1 || guest.length == 1) {
            res.locals.username = req.signedCookies.username;
            next();
        }
        else {
            res.redirect('/');
        }
    });
}
exports.requireLogin = requireLogin;
function requireUsername(req, res, next) {
    if (req.params.username !== req.signedCookies.username) {
        res.render('./other/bug');
    }
    else {
        next();
    }
}
exports.requireUsername = requireUsername;
