import express from 'express';
import * as admin from '../controller/admin/admin.controller.js';
import * as authController from '../controller/admin/admin.auth.js';
import { requireLogin, ifLoggedIn } from '../middleware/admin.middleware.js';
var router = express.Router();
router.get('/', ifLoggedIn, admin.getIndex);
router.get('/console', requireLogin, admin.getConsole);
router.post('/console', requireLogin, authController.signup);
router.post('/', authController.login);
router.get('/logout', authController.logout);
// product

router.post(
	'/product/create',
	requireLogin,
	admin.ProductController.createProduct,
);
router.post(
	'/product/update/:id',
	requireLogin,
	admin.ProductController.updateProduct,
);
router.delete(
	'/product/delete/:id',
	requireLogin,
	admin.ProductController.deleteProduct,
);
//member

router.post(
	'/member/create',
	requireLogin,
	admin.MemberController.createMember,
);
router.post(
	'/member/update/:id',
	requireLogin,
	admin.MemberController.updateMember,
);
router.delete(
	'/member/delete/:id',
	requireLogin,
	admin.MemberController.deleteMember,
);
//guest

router.delete(
	'/guest/delete/:id',
	requireLogin,
	admin.GuestController.deleteGuest,
);
export default router;
