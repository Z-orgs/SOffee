import express from 'express';
import csurf from 'csurf';
import * as indexController from '../controller/user/user.controller.js';
import * as authController from '../controller/user/user.auth.js';
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
router.post('/bill', requireLogin, indexController.submitBill);
router.post('/contact', requireLogin, indexController.sendMessage);
router.get('/logout', requireLogin, authController.logout);
router.post('/changePassword', requireLogin, authController.changePassword);
router.get('/member/:username', requireLogin, indexController.getMember);
router.post(
	'/member/:username',
	requireLogin,
	requireUsername,
	indexController.updateMember,
	authController.logout,
);
export default router;
