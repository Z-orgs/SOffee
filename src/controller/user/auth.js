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
exports.changePassword = exports.logout = exports.auth = void 0;
const SOffee_1 = __importDefault(require("../../SOffee"));
const md5_1 = __importDefault(require("md5"));
const shortid_1 = __importDefault(require("shortid"));
const mls = 18000000;
function auth(req, res) {
    const typeOfForm = req.body.typeOfForm;
    if (typeOfForm === 'login') {
        ((req, res) => {
            const username = req.body.username;
            const password = (0, md5_1.default)(req.body.password);
            SOffee_1.default.Member.find({ username: username })
                .then((data) => {
                if (data.length) {
                    if (data[0].password === password) {
                        res.cookie('username', req.body.username, {
                            signed: true,
                            path: '/',
                            secure: true,
                            expires: new Date(Date.now() + mls),
                            httpOnly: true,
                        });
                        res.redirect('/');
                    }
                    else {
                        res.render('./user/index', {
                            msg: 'Wrong password.',
                        });
                    }
                }
                else {
                    res.render('./user/index', {
                        msg: 'Member does not exist.',
                    });
                }
            })
                .catch((err) => {
                console.log(err);
            });
        })(req, res);
    }
    else if (typeOfForm === 'signup') {
        ((req, res) => {
            const username = req.body.username;
            const password = (0, md5_1.default)(req.body.password);
            const rePassword = (0, md5_1.default)(req.body.rePassword);
            if (password !== rePassword) {
                return res.render('./user/index', {
                    msg: 'New passwords are not the same.',
                });
            }
            SOffee_1.default.Member.find({ username: username })
                .then((data) => {
                if (!data.length) {
                    SOffee_1.default.Member.create({
                        username: username,
                        password: password,
                    }).then((log) => {
                        res.render('./user/index', {
                            msg: 'Sign up successful.',
                        });
                    });
                }
                else {
                    res.render('./user/index', {
                        msg: 'User exist.',
                    });
                }
            })
                .catch((err) => {
                console.log(err);
            });
        })(req, res);
    }
    else if (typeOfForm === 'guest') {
        ((req, res) => __awaiter(this, void 0, void 0, function* () {
            let tempUsername = shortid_1.default.generate();
            const memberList = yield SOffee_1.default.Member.find({ username: tempUsername });
            while (memberList.length !== 0) {
                tempUsername = shortid_1.default.generate();
            }
            SOffee_1.default.Guest.create({ username: tempUsername, date: Date.now() })
                .then((data) => {
                res.cookie('username', tempUsername, {
                    signed: true,
                    path: '/',
                    secure: true,
                    expires: new Date(Date.now() + mls * 10),
                    httpOnly: true,
                });
                res.redirect('/');
            })
                .catch((err) => {
                console.log(err);
                res.redirect('/');
            });
        }))(req, res);
    }
    return;
}
exports.auth = auth;
function logout(req, res) {
    try {
        res.clearCookie('username', { path: '/' });
        res.redirect('/');
    }
    catch (error) {
        console.log(error);
        res.redirect('/');
    }
}
exports.logout = logout;
function changePassword(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const oldPw = (0, md5_1.default)(req.body.oldPw);
        const newPw = (0, md5_1.default)(req.body.newPw);
        const rePw = (0, md5_1.default)(req.body.rePw);
        try {
            const member = yield SOffee_1.default.Member.findOne({
                username: req.signedCookies.username,
            });
            if (oldPw !== (member === null || member === void 0 ? void 0 : member.password)) {
                res.status(400).json({ status: 400, msg: 'Wrong password' });
            }
            else if (newPw !== rePw) {
                res.status(401).json({
                    status: 401,
                    msg: 'Passwords are not the same.',
                });
            }
            else {
                SOffee_1.default.Member.updateOne({
                    username: req.signedCookies.username,
                    password: oldPw,
                }, {
                    $set: {
                        password: newPw,
                    },
                });
                res.status(200).json({ status: 200, msg: 'OK' });
            }
        }
        catch (err) {
            console.log(err);
            res.status(500).json({ status: 500, msg: 'failed' });
        }
    });
}
exports.changePassword = changePassword;
