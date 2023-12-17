import * as crypto from 'crypto';

export const sendotp = async (user)=>{
    const emailtoken =crypto.randomBytes(8).toString('hex');
    const emailtTokenExpirationTime = new Date()
    emailtTokenExpirationTime.setDate(emailtTokenExpirationTime.getDate()+ 1);
    
    console.log(emailtoken)

    user.emailConfirmedToken = emailtoken
    user.emailTokenExpiration = emailtTokenExpirationTime
    return user;
};

export const resetPasswordOtp = async (user)=>{
    const generateResetToken = crypto.randomBytes(7).toString('hex');

    console.log(generateResetToken)
    const resetTokenExpiration = new Date();
    resetTokenExpiration.setHours(resetTokenExpiration.getHours()+ 1);
    
    user.resetPasswordToken = generateResetToken;
    user.resetTokenExpiration = resetTokenExpiration
    return user;
}