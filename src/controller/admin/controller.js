import SOffee from '../../SOffee/index.js';
import imgur from 'imgur';
import appRoot from 'app-root-path';
import fs from 'fs';
import shortid from 'shortid';
import md5 from 'md5';
import formatDate from '../../function/index.js';
function getIndex(req, res) {
	res.render('./admin/index');
}
async function getConsole(req, res) {
	try {
		const members = await SOffee.Member.find({}).sort({ date: -1 });
		const products = await SOffee.Product.find({}).sort({ date: -1 });
		const guests = await SOffee.Guest.find({}).sort({ date: -1 });
		const bills = await SOffee.Bill.find({ isSend: true }).sort({
			date: -1,
		});
		const admins = await SOffee.Admin.find({}).sort({ date: -1 });
		const messages = await SOffee.Message.find({}).sort({ date: -1 });
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
}
const ProductController = {
	createProduct: async (req, res) => {
		try {
			if (req.files) {
				const image = req.files.image;
				const uploadPath = appRoot + '/src/public/files/' + image.name;
				await image.mv(uploadPath);
				let uploadResult = await imgur.uploadFile(uploadPath);
				fs.unlinkSync(uploadPath);
				const { name, price, category, quantity, sold } = req.body;
				await SOffee.Product.create({
					name: name ? name : '',
					price: price ? price : 0,
					quantity: quantity ? quantity : 0,
					sold: sold ? sold : 0,
					category: category ? category : '',
					image: uploadResult ? uploadResult.link : '',
					date: formatDate(new Date()),
				});
			} else {
				const { name, price, category, quantity, sold } = req.body;
				await SOffee.Product.create({
					name: name ? name : '',
					price: price ? price : 0,
					quantity: quantity ? quantity : 0,
					sold: sold ? sold : 0,
					category: category ? category : '',
					date: formatDate(new Date()),
				});
			}
		} catch (error) {
			console.log(error);
		} finally {
			res.redirect('/admin/console');
		}
	},
	updateProduct: async (req, res) => {
		try {
			if (req.files) {
				const image = req.files.image;
				const uploadPath = appRoot + '/src/public/files/' + image.name;
				await image.mv(uploadPath);
				let uploadResult = await imgur.uploadFile(uploadPath);
				fs.unlinkSync(uploadPath);
				const { name, price, category, quantity, sold } = req.body;
				await SOffee.Product.findByIdAndUpdate(req.params.id, {
					$set: {
						name,
						price,
						quantity,
						sold,
						category,
						image: uploadResult ? uploadResult.link : '',
					},
				});
			} else {
				const { name, price, category, quantity, sold } = req.body;
				await SOffee.Product.findByIdAndUpdate(req.params.id, {
					$set: {
						name,
						price,
						quantity,
						sold,
						category,
					},
				});
			}
		} catch (error) {
			console.log(error);
		} finally {
			res.redirect('/admin/console');
		}
	},
	deleteProduct: async (req, res) => {
		await SOffee.Product.deleteOne({ _id: req.params.id });
		res.json({ msg: 'ok' });
	},
};
const MemberController = {
	createMember: async (req, res) => {
		try {
			if (req.files) {
				const image = req.files.image;
				const uploadPath = appRoot + '/src/public/files/' + image.name;
				await image.mv(uploadPath);
				let uploadResult = await imgur.uploadFile(uploadPath);
				fs.unlinkSync(uploadPath);
				const { name, dob, address, username, password, star, tel } = req.body;
				await SOffee.Member.create({
					name: name ? name : '',
					dob: dob ? dob : formatDate(new Date()),
					address: address ? address : '',
					username: username ? username : shortid.generate(),
					password: password ? md5(password) : md5('soffee'),
					star: star ? star : 0,
					tel: tel ? tel : '',
					image: uploadResult ? uploadResult.link : '',
				});
			} else {
				const { name, dob, address, username, password, star, tel } = req.body;
				await SOffee.Member.create({
					name: name ? name : '',
					dob: dob ? dob : formatDate(new Date()),
					address: address ? address : '',
					username: username ? username : shortid.generate(),
					password: password ? md5(password) : md5('soffee'),
					star: star ? star : 0,
					tel: tel ? tel : '',
				});
			}
		} catch (error) {
			console.log(error);
		} finally {
			res.redirect('/admin/console');
		}
	},
	updateMember: async (req, res) => {
		try {
			if (req.files) {
				const image = req.files.image;
				const uploadPath = appRoot + '/src/public/files/' + image.name;
				await image.mv(uploadPath);
				let uploadResult = await imgur.uploadFile(uploadPath);
				fs.unlinkSync(uploadPath);
				const { name, dob, address, username, password, star, tel } = req.body;
				await SOffee.Member.findByIdAndUpdate(req.params.id, {
					$set: {
						name: name ? name : '',
						dob: dob ? dob : formatDate(new Date()),
						address: address ? address : '',
						username: username ? username : shortid.generate(),
						password: password ? md5(password) : md5('soffee'),
						star: star ? star : 0,
						tel: tel ? tel : '',
						image: uploadResult ? uploadResult.link : '',
					},
				});
			} else {
				const { name, dob, address, username, password, star, tel } = req.body;
				await SOffee.Member.findByIdAndUpdate(req.params.id, {
					$set: {
						name: name ? name : '',
						dob: dob ? dob : formatDate(new Date()),
						address: address ? address : '',
						username: username ? username : shortid.generate(),
						password: password ? md5(password) : md5('soffee'),
						star: star ? star : 0,
						tel: tel ? tel : '',
					},
				});
			}
		} catch (error) {
			console.log(error);
		} finally {
			res.redirect('/admin/console');
		}
	},
	deleteMember: async (req, res) => {
		await SOffee.Member.deleteOne({ _id: req.params.id });
		res.json({ msg: 'ok' });
	},
};
const GuestController = {
	deleteGuest: async (req, res) => {
		await SOffee.Guest.deleteOne({ _id: req.params.id });
		res.json({ msg: 'ok' });
	},
};
const AdminController = {
	createAdmin: async (req, res) => {
		try {
			await SOffee.Admin.create({
				username: req.body.username,
				password: md5(req.body.password),
			});
		} catch (error) {
			console.log(error);
		} finally {
			res.redirect('/admin/console');
		}
	},
	updateAdmin: async (req, res) => {
		try {
			await SOffee.Admin.findByIdAndUpdate(req.params.id, {
				$set: {
					username: req.body.username,
					password: md5(req.body.password),
				},
			});
		} catch (error) {
			console.log(error);
		} finally {
			res.redirect('/admin/console');
		}
	},
	deleteAdmin: async (req, res) => {
		// await SOffee.Admin.deleteOne({ _id: req.params.id });
		res.json({ msg: 'error' });
	},
};
const BillController = {
	updateBill: async (req, res) => {
		try {
			await SOffee.Bill.findByIdAndUpdate(req.params.id, {
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
	},
	deleteBill: async (req, res) => {
		await SOffee.Bill.deleteOne({ _id: req.params.id });
		res.json({ msg: 'ok' });
	},
};
const MessageController = {
	deleteMessage: async (req, res) => {
		await SOffee.Message.deleteOne({ _id: req.params.id });
		res.json({ msg: 'ok' });
	},
};
export {
	getIndex,
	getConsole,
	ProductController,
	MemberController,
	GuestController,
	AdminController,
	BillController,
	MessageController,
};
