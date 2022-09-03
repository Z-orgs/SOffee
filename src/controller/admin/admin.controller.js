import SOffee from '../../SOffee/index.js';
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
function product(req, res) {
	if (req.body.typeOfForm === 'update') {
		((req, res) => {})(req, res);
	} else if (req.body.typeOfForm === 'add') {
		((req, res) => {})(req, res);
	} else if (req.body.typeOfForm === 'delete') {
		((req, res) => {})(req, res);
	}
}
export { getIndex, getConsole };
