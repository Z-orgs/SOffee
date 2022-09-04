import SOffee from '../../SOffee/index.js';
import imgur from 'imgur';
import appRoot from 'app-root-path';
import fs from 'fs';
import shortid from 'shortid';
import md5 from 'md5';
function getIndex(req, res) {
	res.render('./admin/index');
}
async function getConsole(req, res) {
	try {
		const members = await SOffee.Member.find({});
		const products = await SOffee.Product.find({});
		const guests = await SOffee.Guest.find({});
		const bills = await SOffee.Bill.find({});
		const admins = await SOffee.Admin.find({});
		res.render('./admin/console', {
			members: members,
			products: products,
			guests: guests,
			bills: bills,
			admins: admins,
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
				});
			} else {
				const { name, price, category, quantity, sold } = req.body;
				await SOffee.Product.create({
					name: name ? name : '',
					price: price ? price : 0,
					quantity: quantity ? quantity : 0,
					sold: sold ? sold : 0,
					category: category ? category : '',
					image: '',
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
				console.log(req.body);
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
				console.log(req.body);
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
		res.redirect('/admin/console');
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
				const { name, dob, address, username, password, star, tel } =
					req.body;
				await SOffee.Member.create({
					name: name ? name : '',
					dob: dob ? dob : Date.now(),
					address: address ? address : '',
					username: username ? username : shortid.generate(),
					password: password ? md5(password) : md5('soffee'),
					star: star ? star : 0,
					tel: tel ? tel : '',
					image: uploadResult ? uploadResult.link : '',
				});
			} else {
				const { name, dob, address, username, password, star, tel } =
					req.body;
				await SOffee.Member.create({
					name: name ? name : '',
					dob: dob ? dob : Date.now(),
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
				const { name, dob, address, username, password, star, tel } =
					req.body;
				await SOffee.Member.findByIdAndUpdate(req.params.id, {
					$set: {
						name: name ? name : '',
						dob: dob ? dob : Date.now(),
						address: address ? address : '',
						username: username ? username : shortid.generate(),
						password: password ? md5(password) : md5('soffee'),
						star: star ? star : 0,
						tel: tel ? tel : '',
						image: uploadResult ? uploadResult.link : '',
					},
				});
			} else {
				const { name, dob, address, username, password, star, tel } =
					req.body;
				await SOffee.Member.findByIdAndUpdate(req.params.id, {
					$set: {
						name: name ? name : '',
						dob: dob ? dob : Date.now(),
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
		res.redirect('/admin/console');
	},
};
export { getIndex, getConsole, ProductController, MemberController };
