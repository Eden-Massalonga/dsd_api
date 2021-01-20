const { Model } = require('sequelize');
const Sequelize = require('sequelize');
const sequelize = require('../config/database');


class Utente extends Model {};

Utente.init({
    nome: {
        type: Sequelize.STRING,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    comprovativo: {
        type: Sequelize.STRING,
        allowNull: true
    }
}, {
    sequelize,
    modelName: 'utente'
});

module.exports = Utente;