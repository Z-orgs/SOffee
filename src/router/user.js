"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const csurf_1 = __importDefault(require("csurf"));
const indexController = __importStar(require("../controller/user/controller"));
const authController = __importStar(require("../controller/user/auth"));
const user_1 = require("../middleware/user");
var router = (0, express_1.Router)();
var csrfProtection = (0, csurf_1.default)({ cookie: true });
router.get('/', indexController.getIndex);
router.post('/', authController.auth);
router.get('/product/:id', user_1.requireLogin, indexController.getProduct);
router.get('/cart', user_1.requireLogin, indexController.getCart);
router.post('/addToCart', user_1.requireLogin, indexController.addToCart);
router.post('/cart', user_1.requireLogin, indexController.submitCart);
router.get('/cart/bill', user_1.requireLogin, csrfProtection, indexController.getBill);
router.get('/bill', user_1.requireLogin, indexController.getUserBill);
router.post('/bill', user_1.requireLogin, indexController.submitBill);
router.post('/contact', user_1.requireLogin, indexController.sendMessage);
router.get('/logout', user_1.requireLogin, authController.logout);
router.post('/changePassword', user_1.requireLogin, authController.changePassword);
router.get('/member/:username', user_1.requireLogin, indexController.getMember);
router.post('/member/:username', user_1.requireLogin, user_1.requireUsername, indexController.updateMember, authController.logout);
exports.default = router;
