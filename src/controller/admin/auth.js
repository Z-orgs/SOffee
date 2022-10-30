"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.login = void 0;
const SOffee_1 = __importDefault(require("../../SOffee"));
const md5_1 = __importDefault(require("md5"));
const mls = 18000000;
function login(req, res) {
    const username = req.body.username;
    const password = (0, md5_1.default)(req.body.password);
    SOffee_1.default.Admin.findOne({ username: username })
        .then((data) => {
        if (data) {
            if (data.password === password) {
                res.cookie('username', req.body.username, {
                    signed: true,
                    path: '/admin',
                    secure: true,
                    expires: new Date(Date.now() + mls),
                    httpOnly: true,
                });
                res.redirect('/admin/console');
            }
            else {
                res.locals.msg = 'Wrong password.';
                res.render('./admin/index');
            }
        }
        else {
            res.locals.msg = 'Admin does not exist.';
            res.render('./admin/index');
        }
    })
        .catch((err) => {
        console.log(err);
    });
}
exports.login = login;
function logout(req, res) {
    res.clearCookie('username', { path: '/admin' });
    res.redirect('/admin');
}
exports.logout = logout;
