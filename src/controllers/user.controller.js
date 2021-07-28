const Joi = require('joi');
const bcrypt = require('bcrypt');
const User = require('../models/user.model');

const updateSchema = Joi.object({
  first_name: Joi.string(),
  last_name: Joi.string(),
  email: Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ['com', 'net'] },
  }),
  password: Joi.string().min(7).max(30),
  mobile_no: Joi.string()
    .length(10)
    .pattern(/^[0-9]+$/),
  address: Joi.string(),
});

const getUsers = async (req, res) => {
  const toSkip = req.query.offset ? Number(req.query.offset) : 0;
  const limitNo = req.query.limit ? Number(req.query.limit) : 0;

  delete req.query.offset;
  delete req.query.limit;

  const key = Object.keys(req.query)[0];
  const value = req.query[key];
  const cond = {};
  let results;

  cond[key] = value;

  if (key && value) {
    results = await User.find({ ...cond })
      .select('-password')
      .skip(toSkip)
      .limit(limitNo)
      .exec();
  } else {
    results = await User.find({})
      .select('-password')
      .skip(toSkip)
      .limit(limitNo)
      .exec();
  }

  res.send(results);
};

const updateUser = async (req, res) => {
  try {
    if (!req.query.id) {
      // eslint-disable-next-line no-throw-literal
      throw { name: 'InvalidId' };
    }
    const data = await updateSchema.validateAsync(req.body);
    if (data.password) {
      const hashedPassword = await bcrypt.hash(data.password, 10);
      data.password = hashedPassword;
    }

    // eslint-disable-next-line no-underscore-dangle
    const user = await User.findByIdAndUpdate(req.query.id, data, {
      new: true,
    })
      .select('-password')
      .exec();

    return res.status(201).send(user);
  } catch (err) {
    const error = { message: '' };

    if (err.name === 'ValidationError') {
      error.message = `invalid ${err.details[0].message.split('"')[1]}`;
    } else if (err.name === 'InvalidId') {
      error.message = 'Invalid user id';
    } else if (err.code === 11000) {
      error.message = 'email already exists';
    } else {
      error.message = err.message;
    }
    return res.status(400).send(error);
  }
};

module.exports = { getUsers, updateUser };
