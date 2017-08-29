'use strict';

const _ = require('lodash');
const joi = require('joi');
const { insertSchema: addressInsertSchema } = require('./address');

const baseSchema = {
  firstName: joi.string().max(100).required(),
  lastName: joi.string().max(150).required(),
  username: joi.string().max(150).required(),
  email: joi.string().max(200).required(),
  addresses: joi.array().items(addressInsertSchema).allow([], null).required()
};

module.exports.insertSchema = joi.object().keys(baseSchema);

module.exports.updateSchema = joi.object().keys(_.merge({
  id: joi.number().integer().positive().required()
}, baseSchema));
