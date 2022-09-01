import express from 'express';
import cookieParser from 'cookie-parser';
function configApp(app) {
    app.use(express.static('./src/public'));
    app.set('view engine', 'hbs');
    app.set('views', './src/views');
    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());
    app.use(cookieParser(process.env.SECRET));
}
export default configApp;