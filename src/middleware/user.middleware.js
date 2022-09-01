import * as SOCoffee from '../config/DB/database.model.js';
async function requireLogin(req, res, next) {
	var [member, guest] = await Promise.all([
		SOCoffee.Member.find({ username: req.signedCookies.username }),
		SOCoffee.Guest.find({ username: req.signedCookies.username }),
	]);
	if (member.length == 1 || guest.length == 1) {
		res.locals.username = req.signedCookies.username;
		next();
	} else {
		res.redirect('/');
	}
}
function requireUsername(req, res, next) {
	if (req.params.username !== req.signedCookies.username) {
		res.render('./other/bug');
	} else {
		next();
	}
}

export { requireLogin, requireUsername };
