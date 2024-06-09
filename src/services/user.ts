import bcrypt from "bcryptjs";
import User from "../models/user";
import { Types } from "mongoose";

export const findUserByUsername = async (username: string) => await User.findOne({ username });

export const findUserById = async (id:Types.ObjectId) => await User.findById(id)


export const createUser = async (username: string, password: string) => {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = new User({ username, password: hashedPassword });
    await user.save();
    return user;
};
