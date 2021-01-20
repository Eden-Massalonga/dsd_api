const { Model } = require('sequelize');
const Sequelize = require('sequelize');
const sequelize = require('../config/database');

const Utente = require('./utente');
const Servico = require('./servico');
const Vinculo = require('./vinculo');

class Pedido extends Model {};

Pedido.init({
    data: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
    },
    detalhes: {
        type: Sequelize.STRING,        
    }
}, {
    sequelize,
    timestamps: false,
    modelName: 'pedido'
});

Utente.belongsTo(Vinculo);
Vinculo.hasMany(Utente);

Pedido.belongsTo(Utente);
Utente.hasMany(Pedido);

Pedido.belongsTo(Servico);
Servico.hasMany(Pedido);

module.exports = Pedido;