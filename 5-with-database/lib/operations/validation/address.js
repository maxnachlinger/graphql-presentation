'use strict';

const _ = require('lodash');
const joi = require('joi');
const { typeToId } = require('./address-type-to-id-map');

const baseSchema = {
  addressTypeId: joi.string().valid(_.keys(typeToId)).required(),
  address: joi.string().max(150).required(),
  address2: joi.string().max(150),
  district: joi.string().max(100).required(),
  city: joi.string().max(100).required(),
  postalCode: joi.string().max(20)
};

module.exports.insertSchema = joi.object().keys(baseSchema);
