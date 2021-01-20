const Sequelize = require('sequelize');

const sequelize = new Sequelize('sgp', 'admin', 'sgpadmin2020', {
    host: 'localhost',
    dialect: 'mysql'
});

module.exports = sequelize;