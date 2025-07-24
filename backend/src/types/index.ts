import mongoose from 'mongoose';

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user'
}

export interface IUser extends mongoose.Document {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(enteredPassword: string): Promise<boolean>;
}

export interface IFile {
  _id: string;
  name: string;
  type: string;
  size: number;
  path: string;
  owner: mongoose.Types.ObjectId;
  parent?: mongoose.Types.ObjectId | null;
  sharedWith: mongoose.Types.ObjectId[];
  isFolder: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IDecodedToken {
  id: string;
  role: UserRole;
  iat: number;
  exp: number;
}

export interface IPresignedUrl {
  url: string;
  expiresAt: Date;
}
