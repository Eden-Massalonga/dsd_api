const { Model } = require('sequelize');
const Sequelize = require('sequelize');
const sequelize = require('../config/database');

class Servico extends Model {};

Servico.init({
    designacao: {
        type: Sequelize.STRING,
        allowNull: false
    }
}, {
    sequelize,
    timestamps: false,
    modelName: 'servico'
});

module.exports = Servico;