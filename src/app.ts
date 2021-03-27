import 'reflect-metadata';
import * as express from 'express';
import * as compression from 'compression';
import * as bodyParser from 'body-parser';
import * as morgan from 'morgan';
import * as cors from 'cors';
import * as helmet from 'helmet';
import * as mongoose from 'mongoose';
import * as errorHandler from 'errorhandler';
import { logger } from './utils/logger';

import container from './config/inversify';
import TYPES from './config/types';

import { RegistrableController } from './controllers/RegistrableController';
import { options } from './config/db';
import NotFound from './exceptions/NotFound';
import BadRequest from './exceptions/BadRequest';
import Unauthorize from './exceptions/Unauthorize';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import Merge from './exceptions/Merge';
import Forbidden from './exceptions/Forbidden';
import Conflict from './exceptions/Conflict';

export default class App {

    private async init() {
        await mongoose.connect(`mongodb://${options.username}:${options.password}@${options.host}:${options.port}/${options.database}`);
        
        const app: express.Application = express();
        app.set('port', process.env.PORT || 3003);
        app.use(errorHandler());
        app.use(compression());
        app.use(helmet());
        if (app.get('env') === 'production') {
            app.use(morgan('combined'));
        } else {
            app.use(morgan('dev'));
        }
        app.use(cors());
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({ extended: true }));

        const controllers: RegistrableController[] = container.getAll<RegistrableController>(TYPES.Controller);
        controllers.forEach(controller => controller.register(app));

        app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
            logger.error(err.stack);
            next(err);
        });

        app.use(function handleNotFound(err: Error, req: express.Request, res: express.Response, next: express.NextFunction) {
            if (err instanceof NotFound) {
                return res.status(404).json({
                    code: 404,
                    success: false,
                    message: err.message
                });
            }
            next(err);
        });

        app.use(function handleBadRequest(err: Error, req: express.Request, res: express.Response, next: express.NextFunction) {
            if (err instanceof BadRequest) {
                return res.status(400).json({
                    code: 400,
                    success: false,
                    message: err.message
                });
            }
            next(err);
        });

        app.use(function handleUnauthorize(err: Error, req: express.Request, res: express.Response, next: express.NextFunction) {
            if (err instanceof Unauthorize || err instanceof JsonWebTokenError ||
                err instanceof TokenExpiredError) {
                return res.status(401).json({
                    code: 401,
                    success: false,
                    message: err.message
                });
            }
            next(err);
        });

        app.use(function handleUnauthorize(err: Error, req: express.Request, res: express.Response, next: express.NextFunction) {
            if (err instanceof Merge) {
                return res.status(403).json({
                    code: 403,
                    success: false,
                    accountMerging: true,
                    message: err.message
                });
            }
            next(err);
        });

        app.use(function handleForbidden(err: Error, req: express.Request, res: express.Response, next: express.NextFunction) {
            if (err instanceof Forbidden) {
                return res.status(403).json({
                    code: 403,
                    success: false,
                    message: err.message
                });
            }
            next(err);
        });

        app.use(function handleConflict(err: Error, req: express.Request, res: express.Response, next: express.NextFunction) {
            if (err instanceof Conflict) {
                return res.status(403).json({
                    code: 409,
                    success: false,
                    message: err.message,
                    data: err.data || {}
                });
            }
            next(err);
        });

        app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
            return res.status(500).json({
                code: 500,
                success: false,
                message: 'Internal server error, try again later'
            });
        });

        return Promise.resolve(app);
    }

    public async start() {
        const app = await this.init();
        const server = app.listen(app.get('port'), async () => {
            console.info(`Digital Mine auth service running at port ${app.get('port')} in ${app.get('env')} mode`);
        });
        return Promise.resolve(server);
    }
}