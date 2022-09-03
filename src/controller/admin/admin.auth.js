import SOffee from '../../SOffee/index.js';
import md5 from 'md5';
const mls = 18000000;

function login(req, res) {
	const username = req.body.username;
	const password = md5(req.body.password);
	SOffee.Admin.findOne({ username: username })
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
				} else {
					res.locals.msg = 'Wrong password.';
					res.render('./admin/index');
				}
			} else {
				res.locals.msg = 'Admin does not exist.';
				res.render('./admin/index');
			}
		})
		.catch((err) => {
			console.log(err);
		});
}

function signup(req, res) {
	const username = req.body.username;
	const password = md5(req.body.password);
	const rePassword = md5(req.body.rePassword);
	if (password !== rePassword) {
		res.locals.msg = 'New passwords are not the same.';
		return res.render('./admin/console');
	}
	SOffee.Admin.findOne({ username: username })
		.then((data) => {
			if (!data) {
				SOffee.Admin.create({
					username: username,
					password: password,
				}).then((log) => {
					res.locals.msg = 'Sign up successful.';
					res.render('./admin/console');
				});
			} else {
				res.locals.msg = 'User exist.';
				res.render('./admin/console');
			}
		})
		.catch((err) => {
			console.log(err);
		});
}

function logout(req, res) {
	res.clearCookie('username', { path: '/admin' });
	res.redirect('/admin');
}
export { login, signup, logout };
