import express, { Request, Response, NextFunction } from 'express';
import createError from 'http-error';
import indexRouter from './router/user';
import adminRouter from './router/admin';
import cookieParser from 'cookie-parser';
import fileUpload from 'express-fileupload';
import 'dotenv/config';
import shortid from 'shortid';
import logger from 'morgan';
const app = express();
app.use(fileUpload());
app.use(express.static('./src/public'));
app.set('view engine', 'hbs');
app.set('views', './src/view');
app.use(logger('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser(shortid.generate()));
app.use('/', indexRouter);
app.use('/admin', adminRouter);
app.use((req: Request, res: Response, next: NextFunction) => {
	next(createError(404));
});
app.use(function (err: any, req: Request, res: Response, next: NextFunction) {
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	res.status(err.status || 500);
	res.render('./other/error');
});
export default app;
