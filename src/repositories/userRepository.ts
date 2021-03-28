import { injectable } from 'inversify';
import { UserModel, User, IUser } from '../models/userSchema';

export interface UserRepository {
    findByEmail(email: string): Promise<UserModel>;
    save(user: IUser): Promise<UserModel>;
}

@injectable()
export class UserRepositoryImp implements UserRepository {

    /**
     * Find an user by email
     * @param email Email
     */
    public async findByEmail(email: string): Promise<UserModel> {
        return await User.findOne({ email }).select('+isVerified');
    }

    /**
     * Save an user in the database
     * @param user User
     */
    public async save(user: IUser): Promise<UserModel> {
        return await User.create(user);
    }

}