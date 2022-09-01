import express from 'express';
import csurf from 'csurf';
import * as indexController from '../controller/index.controller.js';
import * as authController from '../controller/auth/member/member.auth.js';
import {
	requireLogin,
	requireUsername,
} from '../middleware/user.middleware.js';
var router = express.Router();
var csrfProtection = csurf({ cookie: true });
router.get('/', indexController.getIndex);
router.post('/', authController.auth);
router.get('/cart', requireLogin, indexController.getCart);
router.post('/addToCart', requireLogin, indexController.addToCart);
router.post('/cart', requireLogin, indexController.submitCart);
router.get('/cart/bill', requireLogin, csrfProtection, indexController.getBill);
router.get('/bill', requireLogin, indexController.getUserBill);
router.post('/bill', requireUsername, indexController.submitBill);
router.post('/contact', requireLogin, indexController.sendMessage);
router.get('/logout', requireLogin, authController.logout);
router.get('/member/:username', requireLogin, indexController.getMember);
router.post(
	'/member/:username',
	requireLogin,
	requireUsername,
	indexController.updateMember,
	authController.logout
);
export default router;
