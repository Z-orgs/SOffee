import express, { Express } from 'express';
import cookieParser from 'cookie-parser';
import fileUpload from 'express-fileupload';
import 'dotenv/config';
import shortid from 'shortid';
function configApp(app: Express) {
    app.use(fileUpload());
    app.use(express.static('./src/public'));
    app.set('view engine', 'hbs');
    app.set('views', './src/view');
    app.use(express.urlencoded({ extended: false }));
    app.use(express.json());
    app.use(cookieParser(shortid.generate()));
    // app.use(cookieParser('a'));
}
export default configApp;
