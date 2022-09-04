import express from 'express';
import * as adminController from '../controller/admin/admin.controller.js';
import * as authController from '../controller/admin/admin.auth.js';
import { requireLogin, ifLoggedIn } from '../middleware/admin.middleware.js';
var router = express.Router();
router.get('/', ifLoggedIn, adminController.getIndex);
router.get('/console', requireLogin, adminController.getConsole);
router.post('/console', requireLogin, authController.signup);
router.post('/', authController.login);
router.get('/logout', authController.logout);
router.post(
	'/product/create',
	requireLogin,
	adminController.ProductController.createProduct,
);
router.post(
	'/product/update/:id',
	requireLogin,
	adminController.ProductController.updateProduct,
);
router.delete(
	'/product/delete/:id',
	requireLogin,
	adminController.ProductController.deleteProduct,
);
export default router;
