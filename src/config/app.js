"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
require("dotenv/config");
const shortid_1 = __importDefault(require("shortid"));
function configApp(app) {
    app.use((0, express_fileupload_1.default)());
    app.use(express_1.default.static('./src/public'));
    app.set('view engine', 'hbs');
    app.set('views', './src/view');
    app.use(express_1.default.urlencoded({ extended: false }));
    app.use(express_1.default.json());
    app.use((0, cookie_parser_1.default)(shortid_1.default.generate()));
    // app.use(cookieParser('a'));
}
exports.default = configApp;
