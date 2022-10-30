'use strict';
var __importDefault =
	(this && this.__importDefault) ||
	function (mod) {
		return mod && mod.__esModule ? mod : { default: mod };
	};
Object.defineProperty(exports, '__esModule', { value: true });
const mongoose_1 = __importDefault(require('mongoose'));
const url = process.env.URL || '';
function connectDB() {
	try {
		mongoose_1.default.connect(url);
		console.log(`OK: DB`);
		return true;
	} catch (err) {
		console.log(err);
		return false;
	}
}
exports.default = connectDB;
