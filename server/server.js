const initializeApp = require('../config/app');
const sequelize = require('../models/index');
const logger = require('../utils/logger');
require('dotenv').config();

const PORT = process.env.PORT;

async function startServer() {
    try {
        // Test de la connexion à la base de données
        await sequelize.authenticate();
        logger.info('Connecté à la base de données');

        // Initialisation de l'application
        const app = initializeApp();
        
        // Démarrage du serveur
        app.listen(PORT, () => {
            logger.info(`Serveur démarré sur le port ${PORT}`);
        });
    } catch (error) {
        logger.error('Erreur lors du démarrage du serveur:', error);
        process.exit(1);
    }
}

startServer();