import jwt from 'jsonwebtoken';

export const generateJWT = (id , role) => {

    const payload = { id, role };
    const secret = process.env.JWT_SECRET;
    const options = { expiresIn: process.env.JWT_EXPIRES_IN || '1h' };

    return jwt.sign(payload, secret, options);
}