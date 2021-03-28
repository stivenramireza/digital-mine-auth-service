import { Document, Schema, Model, Error, model } from 'mongoose';
import * as bcrypt from 'bcrypt-nodejs';

export interface IUser {
    profile?: any;
    email: string;
    password: string;
    isVerified?: boolean;
}

export interface UserModel extends IUser, Document {}

export const UserSchema: Schema = new Schema({
    profile: {
        name: { type: String },
        mobilePhone: { type: String }
    },
    email: { type: String, unique: true, required: true, trim: true },
    password: { type: String, select: false },
    isVerified: { type: Boolean, select: false, default: true }
}, {
    timestamps: true, versionKey: false 
});

UserSchema.pre<UserModel>('save', function save(next: any) {
    const user = this;
    if (!user.isModified('password')) return next();
    bcrypt.genSalt(10, (err, salt) => {
        if (err) return next(err);
        bcrypt.hash(user.password, salt, undefined, (err: Error, hash) => {
            if (err) return next(err);
            user.password = hash;
            next();
        });
    });
});

UserSchema.pre<UserModel>('save', function save(next: any) {
    const user = this;
    user.email = user.email.toLowerCase();
    next();
});

export const User: Model<UserModel> = model<UserModel>('User', UserSchema);