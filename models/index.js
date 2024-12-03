const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
    dialect: 'mssql',
    host: process.env.DB_Host,
    username: process.env.DB_User,
    password: process.env.DB_Passwd,
    database: 'DB_SQL', // On utilise d'abord master pour la connexion initiale
    port: 1433,
    dialectOptions: {
        options: {
            encrypt: false,
            trustServerCertificate: true,
            connectionTimeout: 30000
        }
    },
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});

module.exports = sequelize;