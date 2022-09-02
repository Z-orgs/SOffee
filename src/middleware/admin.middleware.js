import * as SOCoffee from '../config/DB/database.model.js';
async function requireLogin(req, res, next) {
	const admin = await SOCoffee.Admin.findOne({
		username: req.signedCookies.username,
	});
	if (admin) {
		res.locals.username = req.signedCookies.username;
		next();
	} else {
		res.redrect('/admin');
	}
}
export { requireLogin };
