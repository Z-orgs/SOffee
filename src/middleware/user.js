import SOffee from '../SOffee/index.js';
async function requireLogin(req, res, next) {
	const [member, guest] = await Promise.all([
		SOffee.Member.find({ username: req.signedCookies.username }),
		SOffee.Guest.find({ username: req.signedCookies.username }),
	]);
	if (member.length == 1 || guest.length == 1) {
		res.locals.username = req.signedCookies.username;
		next();
	} else {
		res.render('./user/init');
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
