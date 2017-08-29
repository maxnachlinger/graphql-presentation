'use strict';

module.exports = (sequelize, DataTypes) => {
  const model = sequelize.define('Person', {
    id: {
      type: DataTypes.BIGINT(20),
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    firstName: {
      type: DataTypes.STRING(100),
      field: 'first_name',
      allowNull: false
    },
    lastName: {
      type: DataTypes.STRING(150),
      field: 'last_name',
      allowNull: false
    },
    username: {
      type: DataTypes.STRING(150),
      unique: true,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(200),
      allowNull: false
    }
  },{
    tableName: 'person',
    timestamps: false,
    indexes: [{
      name: 'ux_username',
      unique: true,
      fields: ['username', 'id']
    }]
  });

  return model;
};
