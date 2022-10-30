"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProduct = exports.sendMessage = exports.getUserBill = exports.submitBill = exports.getBill = exports.submitCart = exports.addToCart = exports.getCart = exports.updateMember = exports.getMember = exports.getIndex = void 0;
const SOffee_1 = __importDefault(require("../../SOffee"));
const imgur_1 = __importDefault(require("imgur"));
const function_1 = __importDefault(require("../../function"));
const app_root_path_1 = __importDefault(require("app-root-path"));
const fs_1 = __importDefault(require("fs"));
function getIndex(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const sortByDate = String(req.query.sortByDate) || 'desc';
            const sortByPrice = String(req.query.sortByPrice) || 'desc';
            let product;
            if (sortByDate === 'asc' && sortByPrice === 'asc') {
                product = yield SOffee_1.default.Product.find().sort({
                    date: 'asc',
                    price: 'asc',
                });
            }
            else if (sortByDate === 'desc' && sortByPrice === 'desc') {
                product = yield SOffee_1.default.Product.find().sort({
                    date: 'desc',
                    price: 'desc',
                });
            }
            else if (sortByDate === 'asc' && sortByPrice === 'desc') {
                product = yield SOffee_1.default.Product.find().sort({
                    date: 'asc',
                    price: 'desc',
                });
            }
            else if (sortByDate === 'desc' && sortByPrice === 'asc') {
                product = yield SOffee_1.default.Product.find().sort({
                    date: 'desc',
                    price: 'asc',
                });
            }
            else {
                product = yield SOffee_1.default.Product.find();
            }
            res.locals.username = req.signedCookies.username;
            res.render('./user/index', {
                product: product,
            });
        }
        catch (error) {
            console.log(error);
            res.redirect('/');
        }
    });
}
exports.getIndex = getIndex;
function getMember(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const member = yield SOffee_1.default.Member.findOne({
                username: req.params.username,
            });
            if (member) {
                res.render('./user/member', {
                    member: member,
                });
            }
        }
        catch (error) {
            console.log(error);
            res.redirect('/');
        }
    });
}
exports.getMember = getMember;
function updateMember(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (req.files) {
                const image = req.files.image;
                const uploadPath = app_root_path_1.default + '/src/public/files/' + image.name;
                yield image.mv(uploadPath);
                let uploadResult = yield imgur_1.default.uploadFile(uploadPath);
                fs_1.default.unlinkSync(uploadPath);
                const { name, dob, address, tel } = req.body;
                yield SOffee_1.default.Member.findOneAndUpdate({
                    username: req.params.username,
                }, {
                    $set: {
                        name: name,
                        image: uploadResult ? uploadResult.link : '',
                        dob: dob ? dob : '',
                        address: address,
                        tel: tel,
                    },
                });
            }
            else {
                const { name, dob, address, tel } = req.body;
                yield SOffee_1.default.Member.findOneAndUpdate({
                    username: req.params.username,
                }, {
                    $set: {
                        name: name,
                        dob: dob ? dob : '',
                        address: address,
                        tel: tel,
                    },
                });
            }
        }
        catch (error) {
            console.log(error);
        }
        finally {
            res.redirect('/');
        }
    });
}
exports.updateMember = updateMember;
function getCart(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const [member, guest] = yield Promise.all([
                SOffee_1.default.Member.findOne({ username: req.signedCookies.username }),
                SOffee_1.default.Guest.findOne({ username: req.signedCookies.username }),
            ]);
            let cart = member ? [...member.cart] : [...((guest === null || guest === void 0 ? void 0 : guest.cart) !== undefined ? guest === null || guest === void 0 ? void 0 : guest.cart : [])];
            res.render('./user/cart', {
                cart: cart,
            });
        }
        catch (error) {
            console.log(error);
            res.redirect('/');
        }
    });
}
exports.getCart = getCart;
function addToCart(req, res) {
    try {
        SOffee_1.default.Product.findById(req.body.productId)
            .then((data) => __awaiter(this, void 0, void 0, function* () {
            if (!(data === null || data === void 0 ? void 0 : data.quantity)) {
                return res.status(400).json({ status: 400, msg: 'failed' });
            }
            if (data.quantity < parseInt(req.body.quantity)) {
                return res.status(400).json({ status: 400, msg: 'failed' });
            }
            else {
                const product = yield SOffee_1.default.Product.findById(req.body.productId);
                SOffee_1.default.Member.updateOne({ username: req.signedCookies.username }, {
                    $push: {
                        cart: {
                            product: product,
                            quantity: parseInt(req.body.quantity),
                        },
                    },
                })
                    .then((data) => {
                    if (data.modifiedCount == 1) {
                        return res.status(200).json({ status: 200, msg: 'successful ' });
                    }
                })
                    .catch((err) => {
                    return res.status(400).json({ status: 400, msg: 'failed' });
                });
                SOffee_1.default.Guest.updateOne({ username: req.signedCookies.username }, {
                    cart: [
                        {
                            productId: req.body.productId,
                            quantity: req.body.quantity,
                        },
                    ],
                })
                    .then((data) => {
                    if (data.modifiedCount == 1) {
                        return res.status(200).json({ status: 200, msg: 'successful ' });
                    }
                })
                    .catch((err) => {
                    return res.status(400).json({ status: 400, msg: 'failed' });
                });
            }
        }))
            .catch((err) => {
            console.log(err);
            return res.status(400).json({ status: 400, msg: 'failed' });
        });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ status: 500, msg: 'failed' });
    }
}
exports.addToCart = addToCart;
function submitCart(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let totalMoney = 0;
        for (const product of req.body.submitProduct) {
            SOffee_1.default.Product.findById(product.productId).then((data) => {
                if (data) {
                    product.product = data;
                    totalMoney += data.price * product.quantity;
                }
            });
        }
        const [member, guest] = yield Promise.all([
            SOffee_1.default.Member.findOne({ username: req.signedCookies.username }),
            SOffee_1.default.Guest.findOne({ username: req.signedCookies.username }),
        ]);
        const customer = member ? Object.assign({}, member) : Object.assign({}, guest);
        SOffee_1.default.Bill.create({
            date: (0, function_1.default)(new Date()),
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
    });
}
exports.submitCart = submitCart;
function getBill(req, res) {
    SOffee_1.default.Bill.find({ username: req.signedCookies.username }).then((data) => {
        let result = [...data];
        result = result[result.length - 1];
        result.customer.password = '';
        if (result.isSend == true) {
            res.redirect('/');
        }
        else {
            res.render('./user/bill', {
                bill: result,
                csrfToken: req.csrfToken(),
            });
        }
    });
}
exports.getBill = getBill;
function submitBill(req, res) {
    SOffee_1.default.Bill.updateOne({ _id: req.body.billId }, {
        $set: {
            isSend: true,
            address: req.body.address,
            tel: req.body.tel,
        },
    })
        .then((data) => __awaiter(this, void 0, void 0, function* () {
        yield SOffee_1.default.Member.updateOne({ username: req.signedCookies.username }, {
            $set: {
                cart: [],
            },
        });
        yield SOffee_1.default.Guest.updateOne({ username: req.signedCookies.username }, {
            $set: {
                cart: [],
            },
        });
        res.redirect('/bill');
    }))
        .catch((err) => {
        console.log(err);
        res.redirect('/');
    });
}
exports.submitBill = submitBill;
function getUserBill(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const bills = yield SOffee_1.default.Bill.find({
            username: req.signedCookies.username,
            isSend: true,
        });
        if (bills.length == 0) {
            res.redirect('/');
        }
        else {
            res.render('./user/bills', {
                bills: bills,
            });
        }
    });
}
exports.getUserBill = getUserBill;
function sendMessage(req, res) {
    SOffee_1.default.Message.create({
        username: req.signedCookies.username,
        email: req.body.email,
        subject: req.body.subject,
        message: req.body.message,
        date: (0, function_1.default)(new Date()),
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
exports.sendMessage = sendMessage;
function getProduct(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var product = yield SOffee_1.default.Product.findById(req.params.id);
        res.render('./user/product', {
            product,
        });
    });
}
exports.getProduct = getProduct;
