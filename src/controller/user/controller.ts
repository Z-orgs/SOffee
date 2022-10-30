import SOffee from '../../SOffee';
import imgur from 'imgur';
import formatDate from '../../function';
import appRoot from 'app-root-path';
import fs from 'fs';
import { Request, Response } from 'express';
async function getIndex(req: Request, res: Response) {
    try {
        const sortByDate: string = String(req.query.sortByDate) || 'desc';
        const sortByPrice: string = String(req.query.sortByPrice) || 'desc';
        let product;
        if (sortByDate === 'asc' && sortByPrice === 'asc') {
            product = await SOffee.Product.find().sort({
                date: 'asc',
                price: 'asc',
            });
        } else if (sortByDate === 'desc' && sortByPrice === 'desc') {
            product = await SOffee.Product.find().sort({
                date: 'desc',
                price: 'desc',
            });
        } else if (sortByDate === 'asc' && sortByPrice === 'desc') {
            product = await SOffee.Product.find().sort({
                date: 'asc',
                price: 'desc',
            });
        } else if (sortByDate === 'desc' && sortByPrice === 'asc') {
            product = await SOffee.Product.find().sort({
                date: 'desc',
                price: 'asc',
            });
        } else {
            product = await SOffee.Product.find();
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
async function getMember(req: Request, res: Response) {
    try {
        const member = await SOffee.Member.findOne({
            username: req.params.username,
        });
        if (member) {
            res.render('./user/member', {
                member: member,
            });
        }
    } catch (error) {
        console.log(error);
        res.redirect('/');
    }
}
async function updateMember(req: Request, res: Response) {
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
                        dob: dob ? dob : '',
                        address: address,
                        tel: tel,
                    },
                }
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
                        dob: dob ? dob : '',
                        address: address,
                        tel: tel,
                    },
                }
            );
        }
    } catch (error) {
        console.log(error);
    } finally {
        res.redirect('/');
    }
}
async function getCart(req: Request, res: Response) {
    try {
        const [member, guest] = await Promise.all([
            SOffee.Member.findOne({ username: req.signedCookies.username }),
            SOffee.Guest.findOne({ username: req.signedCookies.username }),
        ]);
        let cart = member ? [...member.cart] : [...(guest?.cart !== undefined ? guest?.cart : [])];
        res.render('./user/cart', {
            cart: cart,
        });
    } catch (error) {
        console.log(error);
        res.redirect('/');
    }
}

function addToCart(req: Request, res: Response) {
    try {
        SOffee.Product.findById(req.body.productId)
            .then(async (data) => {
                if (!data?.quantity) {
                    return res.status(400).json({ status: 400, msg: 'failed' });
                }
                if (data.quantity < parseInt(req.body.quantity)) {
                    return res.status(400).json({ status: 400, msg: 'failed' });
                } else {
                    const product = await SOffee.Product.findById(req.body.productId);
                    SOffee.Member.updateOne(
                        { username: req.signedCookies.username },
                        {
                            $push: {
                                cart: {
                                    product: product,
                                    quantity: parseInt(req.body.quantity),
                                },
                            },
                        }
                    )

                        .then((data) => {
                            if (data.modifiedCount == 1) {
                                return res.status(200).json({ status: 200, msg: 'successful ' });
                            }
                        })
                        .catch((err) => {
                            return res.status(400).json({ status: 400, msg: 'failed' });
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
                        }
                    )
                        .then((data) => {
                            if (data.modifiedCount == 1) {
                                return res.status(200).json({ status: 200, msg: 'successful ' });
                            }
                        })
                        .catch((err) => {
                            return res.status(400).json({ status: 400, msg: 'failed' });
                        });
                }
            })
            .catch((err) => {
                console.log(err);
                return res.status(400).json({ status: 400, msg: 'failed' });
            });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ status: 500, msg: 'failed' });
    }
}
async function submitCart(req: Request, res: Response) {
    let totalMoney: number = 0;
    for (const product of req.body.submitProduct) {
        SOffee.Product.findById(product.productId).then((data) => {
            if (data) {
                product.product = data;
                totalMoney += data.price * product.quantity;
            }
        });
    }
    const [member, guest] = await Promise.all([
        SOffee.Member.findOne({ username: req.signedCookies.username }),
        SOffee.Guest.findOne({ username: req.signedCookies.username }),
    ]);
    const customer = member ? { ...member } : { ...guest };

    SOffee.Bill.create({
        date: formatDate(new Date()),
        totalMoney: totalMoney,
        product: req.body.submitProduct,
        customer: customer,
    })
        .then((data) => {
            res.status(200).json({ status: 200 });
        })
        .catch((err) => {
            console.log(err);

            res.status(400).json({ status: 400 });
        });
}
function getBill(req: Request, res: Response) {
    SOffee.Bill.find({ username: req.signedCookies.username }).then((data) => {
        let result: any = [...data];
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
function submitBill(req: Request, res: Response) {
    SOffee.Bill.updateOne(
        { _id: req.body.billId },
        {
            $set: {
                isSend: true,
                address: req.body.address,
                tel: req.body.tel,
            },
        }
    )
        .then(async (data) => {
            await SOffee.Member.updateOne(
                { username: req.signedCookies.username },
                {
                    $set: {
                        cart: [],
                    },
                }
            );
            await SOffee.Guest.updateOne(
                { username: req.signedCookies.username },
                {
                    $set: {
                        cart: [],
                    },
                }
            );
            res.redirect('/bill');
        })
        .catch((err) => {
            console.log(err);
            res.redirect('/');
        });
}
async function getUserBill(req: Request, res: Response) {
    const bills = await SOffee.Bill.find({
        username: req.signedCookies.username,
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
function sendMessage(req: Request, res: Response) {
    SOffee.Message.create({
        username: req.signedCookies.username,
        email: req.body.email,
        subject: req.body.subject,
        message: req.body.message,
        date: formatDate(new Date()),
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
async function getProduct(req: Request, res: Response) {
    var product = await SOffee.Product.findById(req.params.id);
    res.render('./user/product', {
        product,
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
    getProduct,
};
