import SOffee from '../../SOffee/index.js';
import { formatDate } from '../../function/function.js';
import imgur from 'imgur';
import appRoot from 'app-root-path';
import fs from 'fs';
async function getIndex(req, res) {
	try {
		let product;
		if (req.query.sortByDate && req.query.sortByPrice) {
			product = await SOffee.Product.find({}).sort({
				date: req.query.sortByDate,
				price: req.query.sortByPrice,
			});
		} else if (req.query.sortByDate && !req.query.sortByPrice) {
			product = await SOffee.Product.find({}).sort({
				date: req.query.sortByDate,
			});
		} else if (!req.query.sortByDate && req.query.sortByPrice) {
			product = await SOffee.Product.find({}).sort({
				date: req.query.sortByPrice,
			});
		} else {
			product = await SOffee.Product.find({});
		}
		res.locals.username = req.signedCookies.username;
		res.render('./user/index', {
			product: product,
		});
	} catch (error) {
		console.log(error);
		res.redirect('/');
	}
}
async function getMember(req, res) {
	try {
		const result = await SOffee.Member.findOne({
			username: req.params.username,
		});
		const member = { ...result._doc };
		member.dob = formatDate(result.dob);
		res.render('./user/member', {
			member: member,
		});
	} catch (error) {
		console.log(error);
		res.redirect('/');
	}
}
async function updateMember(req, res) {
	try {
		if (req.files) {
			const image = req.files.image;
			const uploadPath = appRoot + '/src/public/files/' + image.name;
			await image.mv(uploadPath);
			let uploadResult = await imgur.uploadFile(uploadPath);
			fs.unlinkSync(uploadPath);
			const { name, dob, address, tel } = req.body;
			await SOffee.Member.findOneAndUpdate(
				{
					username: req.params.username,
				},
				{
					$set: {
						name: name,
						image: uploadResult ? uploadResult.link : '',
						dob: dob ? new Date(dob) : Date.now(),
						address: address,
						tel: tel,
					},
				},
			);
		} else {
			const { name, dob, address, tel } = req.body;
			await SOffee.Member.findOneAndUpdate(
				{
					username: req.params.username,
				},
				{
					$set: {
						name: name,
						dob: dob ? new Date(dob) : Date.now(),
						address: address,
						tel: tel,
					},
				},
			);
		}
	} catch (error) {
		console.log(error);
	} finally {
		res.redirect('/');
	}
}
async function getCart(req, res) {
	try {
		const [member, guest] = await Promise.all([
			SOffee.Member.findOne({ username: req.signedCookies.username }),
			SOffee.Guest.findOne({ username: req.signedCookies.username }),
		]);
		let cart = member ? [...member.cart] : [...guest.cart];
		cart = await Promise.all(
			cart.map(async (item) => {
				try {
					const data = await SOffee.Product.findById(item.productId);
					item.product = { ...data._doc };
				} catch (err) {
					console.log(err);
				} finally {
					return item;
				}
			}),
		);
		res.render('./user/cart', {
			cart: cart,
		});
	} catch (error) {
		console.log(error);
		res.redirect('/');
	}
}

function addToCart(req, res) {
	try {
		SOffee.Product.findById(req.body.productId)
			.then((data) => {
				if (data.quantity < req.body.quantity) {
					return res
						.status('400')
						.json({ status: 400, msg: 'failed' });
				} else {
					SOffee.Member.updateOne(
						{ username: req.signedCookies.username },
						{
							cart: [
								{
									productId: req.body.productId,
									quantity: req.body.quantity,
								},
							],
						},
					)
						.then((data) => {
							if (data.modifiedCount == 1) {
								return res
									.status('200')
									.json({ status: 200, msg: 'successful ' });
							}
						})
						.catch((err) => {
							return res
								.status('400')
								.json({ status: 400, msg: 'failed' });
						});
					SOffee.Guest.updateOne(
						{ username: req.signedCookies.username },
						{
							cart: [
								{
									productId: req.body.productId,
									quantity: req.body.quantity,
								},
							],
						},
					)
						.then((data) => {
							if (data.modifiedCount == 1) {
								return res
									.status('200')
									.json({ status: 200, msg: 'successful ' });
							}
						})
						.catch((err) => {
							return res
								.status('400')
								.json({ status: 400, msg: 'failed' });
						});
				}
			})
			.catch((err) => {
				console.log(err);
				return res.status('400').json({ status: 400, msg: 'failed' });
			});
	} catch (err) {
		console.log(err);
		return res.status('500').json({ status: 500, msg: 'failed' });
	}
}
async function submitCart(req, res) {
	let totalMoney = 0;
	for (const product of req.body.submitProduct) {
		let result = await SOffee.Product.findById(product.productId);
		result = { ...result._doc };
		product.product = result;
		result = result.price * product.quantity;
		totalMoney += result;
	}
	const [member, guest] = await Promise.all([
		SOffee.Member.findOne({ username: req.signedCookies.username }),
		SOffee.Guest.findOne({ username: req.signedCookies.username }),
	]);
	const customer = member ? { ...member._doc } : { ...guest._doc };
	SOffee.Bill.create({
		date: Date.now(),
		totalMoney: totalMoney,
		product: req.body.submitProduct,
		customer: customer,
	})
		.then((data) => {
			res.status(200).json({ status: 200 });
		})
		.catch((err) => {
			res.status(400).json({ status: 400 });
		});
}
function getBill(req, res) {
	SOffee.Bill.find({ username: req.signedCookies.username }).then((data) => {
		let result = [...data];
		result = result[result.length - 1];
		result.customer.password = '';
		if (result.isSend == true) {
			res.redirect('/');
		} else {
			res.render('./user/bill', {
				bill: result,
				csrfToken: req.csrfToken(),
			});
		}
	});
}
function submitBill(req, res) {
	SOffee.Bill.updateOne(
		{ _id: req.body.billId },
		{
			$set: {
				isSend: true,
				address: req.body.address,
				tel: req.body.tel,
			},
		},
	)
		.then(async (data) => {
			await SOffee.Member.updateOne(
				{ username: req.signedCookies.username },
				{
					$set: {
						cart: [],
					},
				},
			);
			await SOffee.Guest.updateOne(
				{ username: req.signedCookies.username },
				{
					$set: {
						cart: [],
					},
				},
			);
			res.redirect('/bill');
		})
		.catch((err) => {
			console.log(err);
			res.redirect('/');
		});
}
async function getUserBill(req, res) {
	const bills = await SOffee.Bill.find({
		customer: {
			username: req.signedCookies.username,
		},
		isSend: true,
	});
	if (bills.length == 0) {
		res.redirect('/');
	} else {
		res.render('./user/bills', {
			bills: bills,
		});
	}
}
function sendMessage(req, res) {
	SOffee.Message.create({
		username: req.signedCookies.username,
		email: req.body.email,
		subject: req.body.subject,
		message: req.body.message,
	})
		.then((data) => {
			res.render('./user/index', {
				msg: 'sent',
			});
		})
		.catch((err) => {
			res.render('./user/index', {
				msg: 'failed',
			});
		});
}
export {
	getIndex,
	getMember,
	updateMember,
	getCart,
	addToCart,
	submitCart,
	getBill,
	submitBill,
	getUserBill,
	sendMessage,
};
