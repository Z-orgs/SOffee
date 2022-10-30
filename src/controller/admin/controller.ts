import SOffee from '../../SOffee';
import { Request, Response } from 'express';
import imgur from 'imgur';
import appRoot from 'app-root-path';
import fs from 'fs';
import shortid from 'shortid';
import md5 from 'md5';
import formatDate from '../../function';
function getIndex(req: Request, res: Response) {
    res.render('./admin/index');
}
async function getConsole(req: Request, res: Response) {
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
    createProduct: async (req: Request, res: Response) => {
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
    updateProduct: async (req: Request, res: Response) => {
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
    deleteProduct: async (req: Request, res: Response) => {
        await SOffee.Product.deleteOne({ _id: req.params.id });
        res.redirect('/admin/console');
    },
};
const MemberController = {
    createMember: async (req: Request, res: Response) => {
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
    updateMember: async (req: Request, res: Response) => {
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
    deleteMember: async (req: Request, res: Response) => {
        await SOffee.Member.deleteOne({ _id: req.params.id });
        res.redirect('/admin/console');
    },
};
const GuestController = {
    deleteGuest: async (req: Request, res: Response) => {
        await SOffee.Guest.deleteOne({ _id: req.params.id });
        res.redirect('/admin/console');
    },
};
const AdminController = {
    createAdmin: async (req: Request, res: Response) => {
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
    updateAdmin: async (req: Request, res: Response) => {
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
    deleteAdmin: async (req: Request, res: Response) => {
        // await SOffee.Admin.deleteOne({ _id: req.params.id });
        res.redirect('/admin/console');
    },
};
const BillController = {
    updateBill: async (req: Request, res: Response) => {
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
    deleteBill: async (req: Request, res: Response) => {
        await SOffee.Bill.deleteOne({ _id: req.params.id });
        res.redirect('/admin/console');
    },
};
const MessageController = {
    deleteMessage: async (req: Request, res: Response) => {
        await SOffee.Message.deleteOne({ _id: req.params.id });
        res.redirect('/admin/console');
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
