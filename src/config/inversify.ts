import { Container } from 'inversify';
import TYPES from './types';

import { RegistrableController } from '../controllers/RegistrableController';

import { AuthController } from '../controllers/authController';

import { UserServiceImp, UserService } from '../services/userService';

import { UserRepositoryImp, UserRepository } from '../repositories/userRepository';

import { Response } from '../utils/response';

const container = new Container();

// Controllers
container.bind<RegistrableController>(TYPES.Controller).to(AuthController).inSingletonScope();

// Services
container.bind<UserService>(TYPES.UserService).to(UserServiceImp).inSingletonScope();

// Repositories
container.bind<UserRepository>(TYPES.UserRepository).to(UserRepositoryImp).inSingletonScope();

// Utils
container.bind<Response>(TYPES.Response).to(Response).inSingletonScope();

export default container;