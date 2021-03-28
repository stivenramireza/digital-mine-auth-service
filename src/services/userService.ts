import 'reflect-metadata';
import { injectable, inject } from 'inversify';
import TYPES from '../config/types';
import * as mailchecker from 'mailchecker';
import { UserRepository } from '../repositories/userRepository';
import { IUser } from '../models/userSchema';
import BadRequest from '../exceptions/BadRequest';
import Forbidden from '../exceptions/Forbidden';

export interface UserService {
    save(name: string, email: string, password: string, mobilePhone: string): Promise<IUser>;
}

@injectable()
export class UserServiceImp implements UserService {
    
    constructor(@inject(TYPES.UserRepository) private userRepository: UserRepository) {}

    public async save(name: string, email: string, password: string, mobilePhone: string): Promise<IUser> {
        if (!name || !email || !password || !mobilePhone) throw new BadRequest(`Missing param 'name', 'email', 'password' or 'mobilePhone'`);
        if (password.length < 6) throw new BadRequest('Password must have at least 6 characters');
        if (mobilePhone.length < 6) throw new BadRequest('Mobile phone must have at least 10 digits');
        if (!mailchecker.isValid(email)) throw new BadRequest('Invalid email');
        const userEmail = await this.userRepository.findByEmail(email);
        if (userEmail && !userEmail.isVerified) throw new Forbidden('Email already registered');
        return await this.userRepository.save({ email, password, profile: { name, mobilePhone }});
    }
}