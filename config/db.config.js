require('dotenv').config();

module.exports = {
    database: process.env.DB_NAME || 'DB_SQL',
    username: process.env.DB_User,
    password: process.env.DB_Passwd,
    host: process.env.DB_Host,
    dialect: 'mssql',
    dialectOptions: {
        options: {
            trustServerCertificate: true
        }
    },
    migrationStorageTableName: 'sequelize_meta',
    seederStorageTableName: 'sequelize_data'
};