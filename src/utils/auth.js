const Joi = require('joi');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const config = require('../config/config');

const signupSchema = Joi.object({
  first_name: Joi.string().required(),
  last_name: Joi.string().required(),
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ['com', 'net'] },
    })
    .required(),
  password: Joi.string().alphanum().min(7).max(30).required(),
  mobile_no: Joi.number().min(10).max(10),
  address: Joi.string().alphanum().required(),
});

const newToken = (user) =>
  jwt.sign({ id: user.id }, config.secrets.jwt, {
    expiresIn: config.secrets.jwtExp,
  });

const verifyToken = (token) =>
  new Promise((resolve, reject) => {
    jwt.verify(token, config.secrets.jwt, (err, payload) => {
      if (err) return reject(err);
      resolve(payload);
      return null;
    });
  });

const signup = async (req, res) => {
  try {
    const data = await signupSchema.validateAsync(req.body);
    const hashedPassword = await bcrypt.hash(data.password, 10);
  } catch (err) {
    const error = { source: 'signup', message: 'something' };
    res.status(400).send(error);
  }
};
