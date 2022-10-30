import SOffee from '../../SOffee';
import formatDate from '../../function';
import md5 from 'md5';
import shortid from 'shortid';
import { Express, Request, Response } from 'express';
const mls = 18000000;
function auth(req: Request, res: Response) {
    const typeOfForm = req.body.typeOfForm;
    if (typeOfForm === 'login') {
        ((req: Request, res: Response) => {
            const username = req.body.username;
            const password = md5(req.body.password);
            SOffee.Member.find({ username: username })
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
                        } else {
                            res.render('./user/index', {
                                msg: 'Wrong password.',
                            });
                        }
                    } else {
                        res.render('./user/index', {
                            msg: 'Member does not exist.',
                        });
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        })(req, res);
    } else if (typeOfForm === 'signup') {
        ((req: Request, res: Response) => {
            const username = req.body.username;
            const password = md5(req.body.password);
            const rePassword = md5(req.body.rePassword);
            if (password !== rePassword) {
                return res.render('./user/index', {
                    msg: 'New passwords are not the same.',
                });
            }
            SOffee.Member.find({ username: username })
                .then((data) => {
                    if (!data.length) {
                        SOffee.Member.create({
                            username: username,
                            password: password,
                        }).then((log) => {
                            res.render('./user/index', {
                                msg: 'Sign up successful.',
                            });
                        });
                    } else {
                        res.render('./user/index', {
                            msg: 'User exist.',
                        });
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        })(req, res);
    } else if (typeOfForm === 'guest') {
        (async (req: Request, res: Response) => {
            let tempUsername = shortid.generate();
            const memberList = await SOffee.Member.find({ username: tempUsername });
            while (memberList.length !== 0) {
                tempUsername = shortid.generate();
            }
            SOffee.Guest.create({ username: tempUsername, date: formatDate(new Date()) })
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
        })(req, res);
    }
    return;
}
function logout(req: Request, res: Response) {
    try {
        res.clearCookie('username', { path: '/' });
        res.redirect('/');
    } catch (error) {
        console.log(error);
        res.redirect('/');
    }
}
async function changePassword(req: Request, res: Response) {
    const oldPw = md5(req.body.oldPw);
    const newPw = md5(req.body.newPw);
    const rePw = md5(req.body.rePw);
    try {
        const member = await SOffee.Member.findOne({
            username: req.signedCookies.username,
        });
        if (oldPw !== member?.password) {
            return res.status(400).json({ status: 400, msg: 'Wrong password' });
        }
        if (newPw !== rePw) {
            res.status(401).json({
                status: 401,
                msg: 'Passwords are not the same.',
            });
        } else {
            await SOffee.Member.updateOne(
                {
                    username: req.signedCookies.username,
                },
                {
                    $set: {
                        password: newPw,
                    },
                }
            );
            res.status(200).json({ status: 200, msg: 'OK' });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ status: 500, msg: 'failed' });
    }
}
export { auth, logout, changePassword };
