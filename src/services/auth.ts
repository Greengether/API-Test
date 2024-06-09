import bcrypt from 'bcryptjs'
export const matchingPasswords = async (password:string, hash:string) => await bcrypt.compare(password, hash)