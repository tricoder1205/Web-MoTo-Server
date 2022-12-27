import jwt from 'jsonwebtoken';

export const generateToken = (user) => {
    return jwt.sign(
        {
            _id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            cccd: user.cccd,
            image: user.image,
            address: user.address,
        },

        process.env.JWT_SECRET || 'somethingsecret',
        {
            expiresIn: '30d',
        }
    );
};


export const diff_minutes = (dt2, dt1) => 
{
    var diff =(dt2.getTime() - dt1.getTime()) / 1000;
    diff /= 60;
    return Math.abs(Math.round(diff));
}

export const generatePromotionCode = (length) => 
{
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}
