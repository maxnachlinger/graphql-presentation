'use strict';

module.exports = (sequelize, DataTypes) => {
  const model = sequelize.define('Address', {
    id: {
      type: DataTypes.BIGINT(20),
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    addressTypeId: {
      type: DataTypes.INTEGER(6),
      field: 'address_type_id',
      allowNull: false
    },
    personId: {
      type: DataTypes.BIGINT(20),
      field: 'person_id',
      allowNull: false
    },
    address: {
      type: DataTypes.STRING(150),
      allowNull: false
    },
    address2: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
    district: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    city: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    postalCode: {
      type: DataTypes.STRING(20),
      field: 'postal_code',
      allowNull: true
    }
  },{
    tableName: 'address',
    timestamps: false
  });

  return model;
};
