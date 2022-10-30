import express from 'express';
import configApp from './config/app';
import indexRouter from './router/user';
import connectDB from './config/connect';
import adminRouter from './router/admin';
const app = express();
const PORT = process.env.PORT || 80;
configApp(app);
if (connectDB()) {
    app.use('/', indexRouter);
    app.use('/admin', adminRouter);
    app.use((req, res) => {
        res.render('./other/404');
    });
    app.listen(PORT, () => {
        console.log(`PORT: ${PORT}`);
    });
}
