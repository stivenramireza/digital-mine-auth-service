import 'reflect-metadata';
import App from './app';
import { logger } from './utils/logger';
import * as mongoose from 'mongoose';

console.info('Digital Mine auth service');

process.on('uncaughtException', (err: Error) => {
    logger.error('Unhandled Exception ', err.message);
});

process.on('unhandledRejection', (err: Error) => {
    logger.error('Unhandled Rejection ', err.message);
});

process.on('SIGINT', () => {
    mongoose.connection.close(() => {
        console.error('Mongoose default connection is disconnected due to application termination');
        process.exit(0);
    });
});

const app: App = new App();
app.start();
module.exports = app;