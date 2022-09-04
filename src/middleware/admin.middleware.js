import SOffee from '../SOffee/index.js';
async function requireLogin(req, res, next) {
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
async function ifLoggedIn(req, res, next) {
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
