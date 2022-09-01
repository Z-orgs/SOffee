import express from 'express';
import configApp from '../src/config/app.config.js';
import * as SOCoffee from './config/DB/database.model.js';
import indexRouter from './route/index.route.js';
import connectDB from './config/DB/database.connect.js';
import adminRouter from './route/admin.route.js';
const app = express();
const PORT = process.env.PORT || 80;
configApp(app);
connectDB();
app.use('/', indexRouter);
app.use('/admin', adminRouter);
app.use((req, res) => {
    res.render('./other/404');
});
app.listen(PORT, () => {
    console.log(`PORT: ${PORT}`);
});