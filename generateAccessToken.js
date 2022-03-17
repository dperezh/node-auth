import jwt from 'jsonwebtoken';

function generateAccessToken(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
}

export default generateAccessToken;