import { Router } from 'express';
import * as admin from '../controller/admin/controller.js';
import * as authController from '../controller/admin/auth.js';
import { requireLogin, ifLoggedIn } from '../middleware/admin.js';
var router = Router();
router.get('/', ifLoggedIn, admin.getIndex);
router.get('/console', requireLogin, admin.getConsole);
router.post('/', authController.login);
router.get('/logout', authController.logout);
// product

router.post('/product/create', requireLogin, admin.ProductController.createProduct);
router.post('/product/update/:id', requireLogin, admin.ProductController.updateProduct);
router.delete('/product/delete/:id', requireLogin, admin.ProductController.deleteProduct);
//member

router.post('/member/create', requireLogin, admin.MemberController.createMember);
router.post('/member/update/:id', requireLogin, admin.MemberController.updateMember);
router.delete('/member/delete/:id', requireLogin, admin.MemberController.deleteMember);
//guest

router.delete('/guest/delete/:id', requireLogin, admin.GuestController.deleteGuest);
//admin

router.post('/admin/create', requireLogin, admin.AdminController.createAdmin);
router.post('/admin/update/:id', requireLogin, admin.AdminController.updateAdmin);
router.delete('/admin/delete/:id', requireLogin, admin.AdminController.deleteAdmin);
//bill

router.post('/bill/update/:id', requireLogin, admin.BillController.updateBill);
router.delete('/bill/delete/:id', requireLogin, admin.BillController.deleteBill);
//message

router.delete('/message/delete/:id', requireLogin, admin.MessageController.deleteMessage);
export default router;
