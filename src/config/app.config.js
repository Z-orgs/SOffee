import express from 'express';
import cookieParser from 'cookie-parser';
import fileUpload from 'express-fileupload';
function configApp(app) {
	app.use(fileUpload());
	app.use(express.static('./src/public'));
	app.set('view engine', 'hbs');
	app.set('views', './src/views');
	app.use(express.urlencoded({ extended: false }));
	app.use(express.json());
	app.use(cookieParser(process.env.SECRET));
}
export default configApp;
