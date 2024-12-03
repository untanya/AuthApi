const sql = require('mssql');
const dbConfig = require('../config/db.config');

let pool = null;

const connect = async () => {
    try {
        if (pool) {
            return pool;
        }
        pool = await sql.connect(dbConfig);
        console.log('Connecté à la base de données SQL Server');
        return pool;
    } catch (error) {
        console.error('Erreur de connexion à la base de données:', error);
        throw error;
    }
};

const query = async (queryString) => {
    try {
        const connection = await connect();
        const request = new sql.Request(connection);
        const result = await request.query(queryString);
        return result.recordset;
    } catch (error) {
        console.error('Erreur lors de l\'exécution de la requête:', error);
        throw error;
    }
};

module.exports = {
    connect,
    query
};