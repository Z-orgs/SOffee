import express from 'express';
import SOffee from './SOffee/index.js';
import configApp from './config/app.config.js';
import indexRouter from './router/index.route.js';
import connectDB from './config/database.connect.js';
import adminRouter from './router/admin.route.js';
const app = express();
const PORT = process.env.PORT;
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
