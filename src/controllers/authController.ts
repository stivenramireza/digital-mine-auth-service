import * as express from 'express';
import { injectable, inject } from 'inversify';
import TYPES from '../config/types';
import { RegistrableController } from './RegistrableController';
import { UserService } from '../services/userService';
import { Response } from '../utils/response';

@injectable()
export class AuthController implements RegistrableController {

    @inject(TYPES.UserService)
    private userService: UserService;

    @inject(TYPES.Response)
    private response: Response;

    public register(app: express.Application): void {

        /**
         * Register an user with mail and password
         */
        app.route('/signup')
            .post(async(req: express.Request, res: express.Response, next: express.NextFunction) => {
                try {
                    const name = req.body.name;
                    const email = req.body.email;
                    const password = req.body.password;
                    const mobilePhone = req.body.mobilePhone;
                    await this.userService.save(name, email, password, mobilePhone);
                    const data = this.response.dataResponse('User created successfully');
                    return res.status(data.code).json(data);
                } catch (error) {
                    return next(error);
                }
            })
    }
}