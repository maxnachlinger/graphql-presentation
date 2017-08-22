'use strict';

/*
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `address_type_id` smallint(6) NOT NULL DEFAULT '1',
  `address` varchar(150) NOT NULL,
  `address2` varchar(150) DEFAULT NULL,
  `district` varchar(100) NOT NULL,
  `city` varchar(100) NOT NULL,
  `postal_code` varchar(20) DEFAULT NULL,
  `last_update` timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
 */
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
