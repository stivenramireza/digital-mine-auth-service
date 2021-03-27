import { Container } from 'inversify';
import TYPES from './types';

import { RegistrableController } from '../controllers/RegistrableController';

import { Responses } from '../utils/responses';

const container = new Container();

container.bind<RegistrableController>(TYPES.Controller);

container.bind<Responses>(TYPES.Responses).to(Responses).inSingletonScope();

export default container;