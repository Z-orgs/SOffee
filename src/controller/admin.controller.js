import * as SOCoffee from '../config/DB/database.model.js';
function getIndex(req, res) {
    res.render('./admin/index');
}
async function getConsole(req, res) {
    try {
        var members = await SOCoffee.Member.find({});
        var products = await SOCoffee.Product.find({});
        var guests = await SOCoffee.Guest.find({});
        var bills = await SOCoffee.Bill.find({});
        var admins = await SOCoffee.Admin.find({});
        res.render('./admin/console', {
            members: members,
            products: products,
            guests: guests,
            bills: bills,
            admins: admins
        });
    } catch(error) {
        console.log(error);
        res.render('./other/bug');
    }
}
function updateMember() {
    // name: String,
    // dob: Date,
    // Address: String,
    // username: String,
    // password: String,
    // star: Number
    var name = req.body.name;
    var dob = req.body.date;
}
export {
    getIndex, getConsole
};