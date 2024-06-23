'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Shelter extends Model {
   
    static associate(models) {

    }
  }
  Shelter.init({
    address: DataTypes.STRING,
    latitude: DataTypes.DECIMAL,
    longitude: DataTypes.DECIMAL,
    capacity: DataTypes.INTEGER,
    sheltertype: DataTypes.STRING,
    notes: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Shelter',
  });
  return Shelter;
};
