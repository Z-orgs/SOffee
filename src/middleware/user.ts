import SOffee from '../SOffee';
import { Request, Response, NextFunction } from 'express';
async function requireLogin(req: Request, res: Response, next: NextFunction) {
    const [member, guest] = await Promise.all([
        SOffee.Member.find({ username: req.signedCookies.username }),
        SOffee.Guest.find({ username: req.signedCookies.username }),
    ]);
    if (member.length == 1 || guest.length == 1) {
        res.locals.username = req.signedCookies.username;
        next();
    } else {
        res.redirect('/');
    }
}
function requireUsername(req: Request, res: Response, next: NextFunction) {
    if (req.params.username !== req.signedCookies.username) {
        res.render('./other/bug');
    } else {
        next();
    }
}

export { requireLogin, requireUsername };
