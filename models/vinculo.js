const { Model } = require('sequelize');
const Sequelize = require('sequelize');
const sequelize = require('../config/database');

class Vinculo extends Model {};

Vinculo.init({
    designacao: {
        type: Sequelize.STRING,
        allowNull: false
    }
}, {
    sequelize,
    timestamps: false,
    modelName: 'vinculo'
});

module.exports = Vinculo;