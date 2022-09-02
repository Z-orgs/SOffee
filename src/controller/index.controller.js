import * as SOCoffee from '../config/DB/database.model.js';
import { formatDate } from '../function/function.js';
import imgur from 'imgur';
import appRoot from 'app-root-path';
import fs from 'fs';
function getIndex(req, res) {
	try {
		SOCoffee.Product.find({})
			.sort({ price: req.query.sort ? req.query.sort : 1 })
			.then(async (product) => {
				res.locals.username = req.signedCookies.username;
				res.render('./user/index', {
					product: product,
				});
			})
			.catch((err) => {
				console.log(err);
				res.render('./other/bug');
			});
	} catch (error) {
		console.log(error);
		res.redirect('/');
	}
}
async function getMember(req, res) {
	try {
		const result = await SOCoffee.Member.findOne({
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
		let uploadResult;
		if (req.files) {
			const avatarFile = req.files.avatarFile;
			const uploadPath = appRoot + '/src/public/files/' + avatarFile.name;
			await avatarFile.mv(uploadPath);
			uploadResult = await imgur.uploadFile(uploadPath);
			fs.unlinkSync(uploadPath);
		}
		const { name, dob, address, tel } = req.body;
		await SOCoffee.Member.findOneAndUpdate(
			{
				username: req.params.username,
			},
			{
				$set: {
					name: name,
					avatar: uploadResult ? uploadResult.link : '',
					dob: dob ? new Date(dob) : Date.now(),
					address: address,
					tel: tel,
				},
			},
		);
	} catch (error) {
		console.log(error);
	} finally {
		res.redirect('/');
	}
}
async function getCart(req, res) {
	try {
		const [member, guest] = await Promise.all([
			SOCoffee.Member.findOne({ username: req.signedCookies.username }),
			SOCoffee.Guest.findOne({ username: req.signedCookies.username }),
		]);
		let cart = member ? [...member.cart] : [...guest.cart];
		cart = await Promise.all(
			cart.map(async (item) => {
				try {
					const data = await SOCoffee.Product.findById(
						item.productId,
					);
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
		SOCoffee.Product.findById(req.body.productId)
			.then((data) => {
				if (data.quantity < req.body.quantity) {
					return res
						.status('400')
						.json({ status: 400, msg: 'failed' });
				} else {
					SOCoffee.Member.updateOne(
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
					SOCoffee.Guest.updateOne(
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
		let result = await SOCoffee.Product.findById(product.productId);
		result = { ...result._doc };
		product.product = result;
		result = result.price * product.quantity;
		totalMoney += result;
	}
	const [member, guest] = await Promise.all([
		SOCoffee.Member.findOne({ username: req.signedCookies.username }),
		SOCoffee.Guest.findOne({ username: req.signedCookies.username }),
	]);
	const customer = member ? { ...member._doc } : { ...guest._doc };
	SOCoffee.Bill.create({
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
	SOCoffee.Bill.find({ username: req.signedCookies.username }).then(
		(data) => {
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
		},
	);
}
function submitBill(req, res) {
	SOCoffee.Bill.updateOne(
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
			await SOCoffee.Member.updateOne(
				{ username: req.signedCookies.username },
				{
					$set: {
						cart: [],
					},
				},
			);
			await SOCoffee.Guest.updateOne(
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
	const bills = await SOCoffee.Bill.find({
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
	SOCoffee.Message.create({
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
