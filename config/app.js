const express = require('express');
const cors = require('cors');
const logger = require('../utils/logger');
require('dotenv').config();
const path = require('path')

// Import des routes
const authRoutes = require('../routes/auth');
const MeasurementRoutes = require('../routes/lightMeasurements')
const SensorRoutes = require('../routes/sensor')
const webRouter = require('../pages/server.web');

const app = express();

// Configuration des middlewares
app.use(cors());
app.use(express.json());
app.use(logger.request);
app.use(express.static(path.join(__dirname, '../public')));

// Configuration des routes
const setupRoutes = () => {
    app.use('/auth', authRoutes);
    app.use('/measurements', MeasurementRoutes);
    app.use('/sensors', SensorRoutes);
    app.use('/web', webRouter);
    
    // Route par défaut pour les URLs non trouvées
    app.use('*', (req, res) => {
        res.status(404).json({
            success: false,
            message: 'Route non trouvée'
        });
    });

    // Middleware de gestion des erreurs
    app.use((err, req, res, next) => {
        logger.error('Erreur serveur:', err);
        res.status(500).json({
            success: false,
            message: 'Erreur interne du serveur',
            error: err.message
        });
    });
};

// Initialisation de l'application
const initializeApp = () => {
    setupRoutes();
    return app;
};

module.exports = initializeApp;