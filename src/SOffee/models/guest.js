'use strict';
var __importDefault =
	(this && this.__importDefault) ||
	function (mod) {
		return mod && mod.__esModule ? mod : { default: mod };
	};
Object.defineProperty(exports, '__esModule', { value: true });
const mongoose_1 = __importDefault(require('mongoose'));
const Schema = mongoose_1.default.Schema;
const guest = new Schema(
	{
		name: String,
		username: String,
		Address: String,
		cart: [],
		tel: String,
		date: Date,
	},
	{
		collection: 'Guest',
	},
);
const Guest = mongoose_1.default.model('Guest', guest);
exports.default = Guest;
