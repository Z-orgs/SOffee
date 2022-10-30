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
exports.MessageController =
	exports.BillController =
	exports.AdminController =
	exports.GuestController =
	exports.MemberController =
	exports.ProductController =
	exports.getConsole =
	exports.getIndex =
		void 0;
const SOffee_1 = __importDefault(require('../../SOffee'));
const imgur_1 = __importDefault(require('imgur'));
const app_root_path_1 = __importDefault(require('app-root-path'));
const fs_1 = __importDefault(require('fs'));
const shortid_1 = __importDefault(require('shortid'));
const md5_1 = __importDefault(require('md5'));
const function_1 = require('../../function/function');
function getIndex(req, res) {
	res.render('./admin/index');
}
exports.getIndex = getIndex;
function getConsole(req, res) {
	return __awaiter(this, void 0, void 0, function* () {
		try {
			let members = yield SOffee_1.default.Member.find({}).sort({
				date: -1,
			});
			const products = yield SOffee_1.default.Product.find({}).sort({
				date: -1,
			});
			const guests = yield SOffee_1.default.Guest.find({}).sort({
				date: -1,
			});
			const bills = yield SOffee_1.default.Bill.find({
				isSend: true,
			}).sort({
				date: -1,
			});
			const admins = yield SOffee_1.default.Admin.find({}).sort({
				date: -1,
			});
			const messages = yield SOffee_1.default.Message.find({}).sort({
				date: -1,
			});
			members = members.map((member) => {
				member = Object.assign({}, member._doc);
				member.dob = (0, function_1.formatDate)(member.dob);
				return member;
			});
			res.render('./admin/console', {
				members: members,
				products: products,
				guests: guests,
				bills: bills,
				admins: admins,
				messages: messages,
			});
		} catch (error) {
			console.log(error);
			res.render('./other/bug');
		}
	});
}
exports.getConsole = getConsole;
const ProductController = {
	createProduct: (req, res) =>
		__awaiter(void 0, void 0, void 0, function* () {
			try {
				if (req.files) {
					const image = req.files.image;
					const uploadPath =
						app_root_path_1.default +
						'/src/public/files/' +
						image.name;
					yield image.mv(uploadPath);
					let uploadResult = yield imgur_1.default.uploadFile(
						uploadPath,
					);
					fs_1.default.unlinkSync(uploadPath);
					const { name, price, category, quantity, sold } = req.body;
					yield SOffee_1.default.Product.create({
						name: name ? name : '',
						price: price ? price : 0,
						quantity: quantity ? quantity : 0,
						sold: sold ? sold : 0,
						category: category ? category : '',
						image: uploadResult ? uploadResult.link : '',
						date: Date.now(),
					});
				} else {
					const { name, price, category, quantity, sold } = req.body;
					yield SOffee_1.default.Product.create({
						name: name ? name : '',
						price: price ? price : 0,
						quantity: quantity ? quantity : 0,
						sold: sold ? sold : 0,
						category: category ? category : '',
						date: Date.now(),
					});
				}
			} catch (error) {
				console.log(error);
			} finally {
				res.redirect('/admin/console');
			}
		}),
	updateProduct: (req, res) =>
		__awaiter(void 0, void 0, void 0, function* () {
			try {
				if (req.files) {
					console.log(req.body);
					const image = req.files.image;
					const uploadPath =
						app_root_path_1.default +
						'/src/public/files/' +
						image.name;
					yield image.mv(uploadPath);
					let uploadResult = yield imgur_1.default.uploadFile(
						uploadPath,
					);
					fs_1.default.unlinkSync(uploadPath);
					const { name, price, category, quantity, sold } = req.body;
					yield SOffee_1.default.Product.findByIdAndUpdate(
						req.params.id,
						{
							$set: {
								name,
								price,
								quantity,
								sold,
								category,
								image: uploadResult ? uploadResult.link : '',
							},
						},
					);
				} else {
					console.log(req.body);
					const { name, price, category, quantity, sold } = req.body;
					yield SOffee_1.default.Product.findByIdAndUpdate(
						req.params.id,
						{
							$set: {
								name,
								price,
								quantity,
								sold,
								category,
							},
						},
					);
				}
			} catch (error) {
				console.log(error);
			} finally {
				res.redirect('/admin/console');
			}
		}),
	deleteProduct: (req, res) =>
		__awaiter(void 0, void 0, void 0, function* () {
			yield SOffee_1.default.Product.deleteOne({ _id: req.params.id });
			res.redirect('/admin/console');
		}),
};
exports.ProductController = ProductController;
const MemberController = {
	createMember: (req, res) =>
		__awaiter(void 0, void 0, void 0, function* () {
			try {
				if (req.files) {
					const image = req.files.image;
					const uploadPath =
						app_root_path_1.default +
						'/src/public/files/' +
						image.name;
					yield image.mv(uploadPath);
					let uploadResult = yield imgur_1.default.uploadFile(
						uploadPath,
					);
					fs_1.default.unlinkSync(uploadPath);
					const {
						name,
						dob,
						address,
						username,
						password,
						star,
						tel,
					} = req.body;
					yield SOffee_1.default.Member.create({
						name: name ? name : '',
						dob: dob ? dob : Date.now(),
						address: address ? address : '',
						username: username
							? username
							: shortid_1.default.generate(),
						password: password
							? (0, md5_1.default)(password)
							: (0, md5_1.default)('soffee'),
						star: star ? star : 0,
						tel: tel ? tel : '',
						image: uploadResult ? uploadResult.link : '',
					});
				} else {
					const {
						name,
						dob,
						address,
						username,
						password,
						star,
						tel,
					} = req.body;
					yield SOffee_1.default.Member.create({
						name: name ? name : '',
						dob: dob ? dob : Date.now(),
						address: address ? address : '',
						username: username
							? username
							: shortid_1.default.generate(),
						password: password
							? (0, md5_1.default)(password)
							: (0, md5_1.default)('soffee'),
						star: star ? star : 0,
						tel: tel ? tel : '',
					});
				}
			} catch (error) {
				console.log(error);
			} finally {
				res.redirect('/admin/console');
			}
		}),
	updateMember: (req, res) =>
		__awaiter(void 0, void 0, void 0, function* () {
			try {
				if (req.files) {
					const image = req.files.image;
					const uploadPath =
						app_root_path_1.default +
						'/src/public/files/' +
						image.name;
					yield image.mv(uploadPath);
					let uploadResult = yield imgur_1.default.uploadFile(
						uploadPath,
					);
					fs_1.default.unlinkSync(uploadPath);
					const {
						name,
						dob,
						address,
						username,
						password,
						star,
						tel,
					} = req.body;
					yield SOffee_1.default.Member.findByIdAndUpdate(
						req.params.id,
						{
							$set: {
								name: name ? name : '',
								dob: dob ? dob : Date.now(),
								address: address ? address : '',
								username: username
									? username
									: shortid_1.default.generate(),
								password: password
									? (0, md5_1.default)(password)
									: (0, md5_1.default)('soffee'),
								star: star ? star : 0,
								tel: tel ? tel : '',
								image: uploadResult ? uploadResult.link : '',
							},
						},
					);
				} else {
					const {
						name,
						dob,
						address,
						username,
						password,
						star,
						tel,
					} = req.body;
					yield SOffee_1.default.Member.findByIdAndUpdate(
						req.params.id,
						{
							$set: {
								name: name ? name : '',
								dob: dob ? dob : Date.now(),
								address: address ? address : '',
								username: username
									? username
									: shortid_1.default.generate(),
								password: password
									? (0, md5_1.default)(password)
									: (0, md5_1.default)('soffee'),
								star: star ? star : 0,
								tel: tel ? tel : '',
							},
						},
					);
				}
			} catch (error) {
				console.log(error);
			} finally {
				res.redirect('/admin/console');
			}
		}),
	deleteMember: (req, res) =>
		__awaiter(void 0, void 0, void 0, function* () {
			yield SOffee_1.default.Member.deleteOne({ _id: req.params.id });
			res.redirect('/admin/console');
		}),
};
exports.MemberController = MemberController;
const GuestController = {
	deleteGuest: (req, res) =>
		__awaiter(void 0, void 0, void 0, function* () {
			yield SOffee_1.default.Guest.deleteOne({ _id: req.params.id });
			res.redirect('/admin/console');
		}),
};
exports.GuestController = GuestController;
const AdminController = {
	createAdmin: (req, res) =>
		__awaiter(void 0, void 0, void 0, function* () {
			try {
				yield SOffee_1.default.Admin.create({
					username: req.body.username,
					password: (0, md5_1.default)(req.body.password),
				});
			} catch (error) {
				console.log(error);
			} finally {
				res.redirect('/admin/console');
			}
		}),
	updateAdmin: (req, res) =>
		__awaiter(void 0, void 0, void 0, function* () {
			try {
				yield SOffee_1.default.Admin.findByIdAndUpdate(req.params.id, {
					$set: {
						username: req.body.username,
						password: (0, md5_1.default)(req.body.password),
					},
				});
			} catch (error) {
				console.log(error);
			} finally {
				res.redirect('/admin/console');
			}
		}),
	deleteAdmin: (req, res) =>
		__awaiter(void 0, void 0, void 0, function* () {
			// await SOffee.Admin.deleteOne({ _id: req.params.id });
			res.redirect('/admin/console');
		}),
};
exports.AdminController = AdminController;
const BillController = {
	updateBill: (req, res) =>
		__awaiter(void 0, void 0, void 0, function* () {
			try {
				yield SOffee_1.default.Bill.findByIdAndUpdate(req.params.id, {
					$set: {
						status: {
							confirm: req.body.confirm,
							shipping: req.body.shipping,
							finish: req.body.finish,
						},
					},
				});
			} catch (error) {
				console.log(error);
			} finally {
				res.redirect('/admin/console');
			}
		}),
	deleteBill: (req, res) =>
		__awaiter(void 0, void 0, void 0, function* () {
			yield SOffee_1.default.Bill.deleteOne({ _id: req.params.id });
			res.redirect('/admin/console');
		}),
};
exports.BillController = BillController;
const MessageController = {
	deleteMessage: (req, res) =>
		__awaiter(void 0, void 0, void 0, function* () {
			yield SOffee_1.default.Message.deleteOne({ _id: req.params.id });
			res.redirect('/admin/console');
		}),
};
exports.MessageController = MessageController;
