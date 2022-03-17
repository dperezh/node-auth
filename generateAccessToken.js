import jwt from 'jsonwebtoken';

function generateAccessToken(payload) {
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
}

export default generateAccessToken;