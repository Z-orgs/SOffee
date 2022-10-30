'use strict';
var __createBinding =
	(this && this.__createBinding) ||
	(Object.create
		? function (o, m, k, k2) {
				if (k2 === undefined) k2 = k;
				var desc = Object.getOwnPropertyDescriptor(m, k);
				if (
					!desc ||
					('get' in desc
						? !m.__esModule
						: desc.writable || desc.configurable)
				) {
					desc = {
						enumerable: true,
						get: function () {
							return m[k];
						},
					};
				}
				Object.defineProperty(o, k2, desc);
		  }
		: function (o, m, k, k2) {
				if (k2 === undefined) k2 = k;
				o[k2] = m[k];
		  });
var __setModuleDefault =
	(this && this.__setModuleDefault) ||
	(Object.create
		? function (o, v) {
				Object.defineProperty(o, 'default', {
					enumerable: true,
					value: v,
				});
		  }
		: function (o, v) {
				o['default'] = v;
		  });
var __importStar =
	(this && this.__importStar) ||
	function (mod) {
		if (mod && mod.__esModule) return mod;
		var result = {};
		if (mod != null)
			for (var k in mod)
				if (
					k !== 'default' &&
					Object.prototype.hasOwnProperty.call(mod, k)
				)
					__createBinding(result, mod, k);
		__setModuleDefault(result, mod);
		return result;
	};
Object.defineProperty(exports, '__esModule', { value: true });
const express_1 = require('express');
const admin = __importStar(require('../controller/admin/controller'));
const authController = __importStar(require('../controller/admin/auth'));
const admin_1 = require('../middleware/admin');
var router = (0, express_1.Router)();
router.get('/', admin_1.ifLoggedIn, admin.getIndex);
router.get('/console', admin_1.requireLogin, admin.getConsole);
router.post('/', authController.login);
router.get('/logout', authController.logout);
// product
router.post(
	'/product/create',
	admin_1.requireLogin,
	admin.ProductController.createProduct,
);
router.post(
	'/product/update/:id',
	admin_1.requireLogin,
	admin.ProductController.updateProduct,
);
router.delete(
	'/product/delete/:id',
	admin_1.requireLogin,
	admin.ProductController.deleteProduct,
);
//member
router.post(
	'/member/create',
	admin_1.requireLogin,
	admin.MemberController.createMember,
);
router.post(
	'/member/update/:id',
	admin_1.requireLogin,
	admin.MemberController.updateMember,
);
router.delete(
	'/member/delete/:id',
	admin_1.requireLogin,
	admin.MemberController.deleteMember,
);
//guest
router.delete(
	'/guest/delete/:id',
	admin_1.requireLogin,
	admin.GuestController.deleteGuest,
);
//admin
router.post(
	'/admin/create',
	admin_1.requireLogin,
	admin.AdminController.createAdmin,
);
router.post(
	'/admin/update/:id',
	admin_1.requireLogin,
	admin.AdminController.updateAdmin,
);
router.delete(
	'/admin/delete/:id',
	admin_1.requireLogin,
	admin.AdminController.deleteAdmin,
);
//bill
router.post(
	'/bill/update/:id',
	admin_1.requireLogin,
	admin.BillController.updateBill,
);
router.delete(
	'/bill/delete/:id',
	admin_1.requireLogin,
	admin.BillController.deleteBill,
);
//message
router.delete(
	'/message/delete/:id',
	admin_1.requireLogin,
	admin.MessageController.deleteMessage,
);
exports.default = router;
