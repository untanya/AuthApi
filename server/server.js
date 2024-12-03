const initializeApp = require('../config/app');
const sequelize = require('../models');
const logger = require('../utils/logger');

const PORT = process.env.PORT || 8080;

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function startServer() {
    try {
        // Attend que SQL Server soit prêt
        await wait(10000); // 10 secondes de délai
        logger.info('Tentative de connexion à la base de données...');
        
        await sequelize.authenticate();
        logger.info('Connecté à la base de données');

        const app = initializeApp();
        
        app.listen(PORT, () => {
            logger.info(`Serveur démarré sur le port ${PORT}`);
        });
    } catch (error) {
        logger.error('Erreur lors du démarrage du serveur:', error);
        process.exit(1);
    }
}

startServer();