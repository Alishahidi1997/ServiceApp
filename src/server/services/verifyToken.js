import jwt from 'jsonwebtoken';

const config = process.env;

const verifyToken = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) return res.status(403).send('ERR_NO_TOKEN');
  const token = authorization.split(' ') && authorization.split(' ')[1];

  if (!token) {
    return res.status(403).send('ERR_NO_TOKEN');
  }
  try {
    const decoded = jwt.verify(token, config.TOKEN_KEY);
    req.userId = decoded.userId;
  } catch (err) {
    return res.status(401).send('ERR_INVALID_TOKEN');
  }
  return next();
};

export default verifyToken;

export const createToken = (user) => {
  const { TOKEN_KEY, TOKEN_EXP } = process.env;
  if (!TOKEN_KEY) throw new Error('ERR_NO_TOKEN_KEY');
  const token = jwt.sign(
    user,
    TOKEN_KEY,
    TOKEN_EXP ? {
      expiresIn: TOKEN_EXP,
    } : {},
  );
  return token;
};
