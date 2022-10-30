'use strict';
var __awaiter =
	(this && this.__awaiter) ||
	function (thisArg, _arguments, P, generator) {
		function adopt(value) {
			return value instanceof P
				? value
				: new P(function (resolve) {
						resolve(value);
				  });
		}
		return new (P || (P = Promise))(function (resolve, reject) {
			function fulfilled(value) {
				try {
					step(generator.next(value));
				} catch (e) {
					reject(e);
				}
			}
			function rejected(value) {
				try {
					step(generator['throw'](value));
				} catch (e) {
					reject(e);
				}
			}
			function step(result) {
				result.done
					? resolve(result.value)
					: adopt(result.value).then(fulfilled, rejected);
			}
			step(
				(generator = generator.apply(thisArg, _arguments || [])).next(),
			);
		});
	};
var __importDefault =
	(this && this.__importDefault) ||
	function (mod) {
		return mod && mod.__esModule ? mod : { default: mod };
	};
Object.defineProperty(exports, '__esModule', { value: true });
exports.ifLoggedIn = exports.requireLogin = void 0;
const SOffee_1 = __importDefault(require('../SOffee'));
function requireLogin(req, res, next) {
	return __awaiter(this, void 0, void 0, function* () {
		const admin = yield SOffee_1.default.Admin.findOne({
			username: req.signedCookies.username,
		});
		if (admin) {
			res.locals.username = req.signedCookies.username;
			next();
		} else {
			res.redirect('/admin');
		}
	});
}
exports.requireLogin = requireLogin;
function ifLoggedIn(req, res, next) {
	return __awaiter(this, void 0, void 0, function* () {
		const admin = yield SOffee_1.default.Admin.findOne({
			username: req.signedCookies.username,
		});
		if (admin) {
			res.redirect('/admin/console');
		} else {
			next();
		}
	});
}
exports.ifLoggedIn = ifLoggedIn;
