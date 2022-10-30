'use strict';
var __importDefault =
	(this && this.__importDefault) ||
	function (mod) {
		return mod && mod.__esModule ? mod : { default: mod };
	};
Object.defineProperty(exports, '__esModule', { value: true });
const express_1 = __importDefault(require('express'));
const app_1 = __importDefault(require('./config/app'));
const user_1 = __importDefault(require('./router/user'));
const connect_1 = __importDefault(require('./config/connect'));
const admin_1 = __importDefault(require('./router/admin'));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 80;
(0, app_1.default)(app);
if ((0, connect_1.default)()) {
	app.use('/', user_1.default);
	app.use('/admin', admin_1.default);
	app.use((req, res) => {
		res.render('./other/404');
	});
	app.listen(PORT, () => {
		console.log(`PORT: ${PORT}`);
	});
}
