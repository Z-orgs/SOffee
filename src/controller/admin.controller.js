import * as SOCoffee from '../config/DB/database.model.js';
function getIndex(req, res) {
	res.render('./admin/index');
}
async function getConsole(req, res) {
	try {
		const members = await SOCoffee.Member.find({});
		const products = await SOCoffee.Product.find({});
		const guests = await SOCoffee.Guest.find({});
		const bills = await SOCoffee.Bill.find({});
		const admins = await SOCoffee.Admin.find({});
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
export { getIndex, getConsole };
