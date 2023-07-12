const express = require('express');
const path = require('path');
const morgan = require('morgan');
const globalErrorHandler = require('./controller/errorController');
const viewRouter = require('./router/viewRouter');
const userRouter = require('./router/userRouter');
const AppError = require('./utility/appError');

const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

const app = express();
// set engine for pug 
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
// development logging
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));
console.log(process.env.NODE_ENV);
// for body reading form req.body
app.use(express.json({ limit: '10kb' }));
// serving static files
app.use(express.static('./public'));
// Router mountain
app.use('/', viewRouter);
app.use('/api/v1/users', userRouter);

// unhandle route
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});
// global errorHandler
app.use(globalErrorHandler);
module.exports = app;