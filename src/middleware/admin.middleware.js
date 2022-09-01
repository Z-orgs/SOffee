import * as SOCoffee from '../config/DB/database.model.js';
function requireLogin(req, res, next) {
	SOCoffee.Admin.findOne({ username: req.signedCookies.username }).then(
		(data) => {
			if (data) {
				res.locals.username = req.signedCookies.username;
				next();
			} else {
				res.redirect('/admin');
			}
		}
	);
}
export { requireLogin };
