import SOffee from '../SOffee';
import { Request, Response, NextFunction } from 'express';
async function requireLogin(req: Request, res: Response, next: NextFunction) {
    const admin = await SOffee.Admin.findOne({
        username: req.signedCookies.username,
    });
    if (admin) {
        res.locals.username = req.signedCookies.username;
        next();
    } else {
        res.redirect('/admin');
    }
}
async function ifLoggedIn(req: Request, res: Response, next: NextFunction) {
    const admin = await SOffee.Admin.findOne({
        username: req.signedCookies.username,
    });
    if (admin) {
        res.redirect('/admin/console');
    } else {
        next();
    }
}
export { requireLogin, ifLoggedIn };
