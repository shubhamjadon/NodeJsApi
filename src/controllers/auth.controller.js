const Joi = require('joi');
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const User = require('../models/user.model');

const signupSchema = Joi.object({
  first_name: Joi.string().required(),
  last_name: Joi.string().required(),
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ['com', 'net'] },
    })
    .required(),
  password: Joi.string().min(7).max(30).required(),
  mobile_no: Joi.string()
    .length(10)
    .pattern(/^[0-9]+$/)
    .required(),
  address: Joi.string().required(),
});

const signinSchema = Joi.object({
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ['com', 'net'] },
    })
    .required(),
  password: Joi.string().min(7).max(30).required(),
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

    const user = await User.create(data);
    const token = newToken(user);
    return res.status(201).send({ token });
  } catch (err) {
    const error = { message: '' };

    if (err.name === 'ValidationError') {
      error.message = `invalid ${err.details[0].message.split('"')[1]}`;
    } else if (err.code === 11000) {
      error.message = 'email already exists';
    }
    return res.status(400).send(error);
  }
};

const signin = async (req, res) => {
  try {
    const data = await signinSchema.validateAsync(req.body);
    const user = await User.findOne({ email: data.email })
      .select('email password')
      .exec();

    if (!user) {
      throw new Error();
    }

    const match = await user.checkPassword(data.password);

    if (!match) {
      throw new Error();
    }

    const token = newToken(user);
    return res.status(201).send({ token });
  } catch (err) {
    return res.status(401).send({ message: 'invalid username or password' });
  }
};

const protect = async (req, res, next) => {
  const bearer = req.headers.authorization;

  if (!bearer || !bearer.startsWith('Bearer ')) {
    return res.status(401).end();
  }

  const token = bearer.split('Bearer ')[1].trim();
  let payload;
  try {
    payload = await verifyToken(token);
  } catch (e) {
    return res.status(401).end();
  }

  const user = await User.findById(payload.id)
    .select('-password')
    .lean()
    .exec();

  if (!user) {
    return res.status(401).end();
  }

  req.user = user;
  return next();
};

module.exports = { signin, signup, protect, signupSchema };
