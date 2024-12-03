const { Sequelize } = require('sequelize');
const config = require('../config/db.config.js');

const sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    {
        host: config.host,
        dialect: config.dialect,
        dialectOptions: config.dialectOptions,
        logging: false // Désactive les logs SQL par défaut
    }
);

module.exports = sequelize;