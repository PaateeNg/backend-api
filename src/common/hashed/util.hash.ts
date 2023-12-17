import * as bcrypt from 'bcrypt';


export const hashed = async(password: string)=>{
    const salt = 10;
    const hash = await bcrypt.hash(password, salt);
    return hash
}

export const comparePassword = async (password: string, hash: string): Promise<boolean>=>{
 return await bcrypt.compare(password, hash)
}