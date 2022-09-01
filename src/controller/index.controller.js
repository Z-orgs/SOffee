import * as SOCoffee from '../config/DB/database.model.js';
import { formatDate } from '../function/function.js';
function getIndex(req, res) {
    try {
        SOCoffee.Product.find({}).sort({ price: req.body.sort ? req.body.sort : 0 })
            .then(async product => {
                res.locals.username = req.signedCookies.username;
                res.render('./user/index', {
                    product: product
                });
            })
            .catch(err => {
                console.log(err);
                res.render('./other/bug');
            });
    } catch(error) {
        console.log(error);
        res.redirect('/');
    }
}
async function getMember(req, res) {
    try {
        var result = await SOCoffee.Member.findOne({ username: req.params.username });
        var member = { ...result._doc };
        member.dob = formatDate(result.dob);
        res.render('./user/member', {
            member: member
        });
    } catch(error) {
        console.log(error);
        res.redirect('/');
    }
}
async function updateMember(req, res) {
    try {
        var { name, dob, address, tel } = req.body;
        await SOCoffee.Member.findOneAndUpdate({
            username: req.params.username
        }, {
            $set: {
                name: name,
                dob: new Date(dob),
                address: address,
                tel: tel
            }
        });
    } catch(error) {
        console.log(error);
    } finally {
        res.redirect('/');
    }
}
async function getCart(req, res) {
    try {
        var [member, guest] = await Promise.all([
            SOCoffee.Member.findOne({ username: req.signedCookies.username }),
            SOCoffee.Guest.findOne({ username: req.signedCookies.username })
        ]);
        var cart = member ? [...member.cart] : [...guest.cart];
        cart = await Promise.all(cart.map(async item => {
            try {
                var data = await SOCoffee.Product.findById(item.productId);
                item.product = { ...data._doc };
            } catch(err) {
                console.log(err);
            } finally {
                return item;
            }
        }));
        res.render('./user/cart', {
            cart: cart
        });
    } catch(error) {
        console.log(error);
        res.redirect('/');
    }
}

function addToCart(req, res) {
    try {
        SOCoffee.Product.findById(req.body.productId)
            .then(data => {
                if(data.quantity < req.body.quantity) {
                    return res.status('400').json({ status: 400 });
                } else {
                    SOCoffee.Member.updateOne({ username: req.signedCookies.username }, {
                        cart: [
                            {
                                productId: req.body.productId,
                                quantity: req.body.quantity
                            }
                        ]
                    })
                        .then(data => {
                            if(data.modifiedCount == 1) {
                                return res.status('200').json({ status: 200 });
                            }
                        })
                        .catch(err => {
                            return res.status('400').json({ status: 400 });
                        });
                    SOCoffee.Guest.updateOne({ username: req.signedCookies.username }, {
                        cart: [
                            {
                                productId: req.body.productId,
                                quantity: req.body.quantity
                            }
                        ]
                    })
                        .then(data => {
                            if(data.modifiedCount == 1) {
                                return res.status('200').json({ status: 200 });
                            }
                        })
                        .catch(err => {
                            return res.status('400').json({ status: 400 });
                        });
                }
            })
            .catch(err => {
                console.log(err);
                return res.status('400').json({ status: 400 });
            });
    } catch(err) {
        console.log(err);
        return res.status('500').json({ status: 500 });
    }
}
async function submitCart(req, res) {
    var totalMoney = 0;
    for(var product of req.body.submitProduct) {
        var money = await SOCoffee.Product.findById(product.productId);
        money = { ...money._doc };
        product.product = money;
        money = money.price * product.quantity;
        totalMoney += money;
    }
    var [member, guest] = await Promise.all([
        SOCoffee.Member.findOne({ username: req.signedCookies.username }),
        SOCoffee.Guest.findOne({ username: req.signedCookies.username })
    ]);
    var customer = member ? { ...member._doc } : { ...guest._doc };
    SOCoffee.Bill.create({
        date: Date.now(),
        totalMoney: totalMoney,
        product: req.body.submitProduct,
        customer: customer
    })
        .then(data => {
            res.status(200).json({ status: 200 });
        })
        .catch(err => {
            res.status(400).json({ status: 400 });
        });
}
function getBill(req, res) {
    SOCoffee.Bill.find({ username: req.signedCookies.username })
        .then(data => {
            var result = [...data];
            result = result[result.length - 1];
            result.customer.password = '';
            if(result.isSend == true) {
                res.redirect('/');
            } else {
                res.render("./user/bill", {
                    bill: result,
                    csrfToken: req.csrfToken()
                });
            }
        });
}
function submitBill(req, res) {
    SOCoffee.Bill.updateOne({ _id: req.body.billId }, {
        $set: {
            isSend: true,
            address: req.body.address,
            tel: req.body.tel
        }
    })
        .then(async data => {
            await SOCoffee.Member.updateOne({ username: req.signedCookies.username }, {
                $set: {
                    cart: []
                }
            });
            await SOCoffee.Guest.updateOne({ username: req.signedCookies.username }, {
                $set: {
                    cart: []
                }
            });
            res.redirect('/bill');
        })
        .catch(err => {
            console.log(err);
            res.redirect('/');
        });
};
async function getUserBill(req, res) {
    var bills = await SOCoffee.Bill.find({
        customer: {
            username: req.signedCookies.username
        },
        isSend: true
    });
    if(bills.length == 0) {
        res.redirect('/');
    } else[
        res.render('./user/bills', {
            bills: bills
        })
    ];
}
function sendMessage(req, res) {
    SOCoffee.Message.create({
        username: req.signedCookies.username,
        email: req.body.email,
        subject: req.body.subject,
        message: req.body.message
    })
        .then(data => {
            res.render('./user/index', {
                msg: "sent"
            });
        })
        .catch(err => {
            res.render('./user/index', {
                msg: "failed"
            });
        });
}
export {
    getIndex, getMember, updateMember, getCart, addToCart, submitCart, getBill, submitBill, getUserBill, sendMessage
};