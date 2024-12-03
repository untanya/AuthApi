const express = require('express');
const router = express.Router();
const LightSensor = require('../models/lightSensor.model');
const logger = require('../utils/logger');
const sequelize = require('sequelize');

// Récupérer tous les utilisateurs
router.get('/', async (req, res) => {
    try {
        const sensor = await LightSensor.findAll();
        logger.info('Donnée du capteur de donnée extraites avec succès.', { count: sensor.length });
        
        res.json({
            success: true,
            data: sensor,
            message: 'Données récupéré avec succès.'
        });
    } catch (error) {
        logger.error('Erreur lors de la récupération des données.', error);
        res.status(500).json({
            success: false,
            error: 'Erreur lors de la récupération des données.',
            details: error.message
        });
    }
});

router.post('/range', async (req, res) => {
  try {
    const { startDate, endDate } = req.body;
    
    const sensors = await LightSensor.findAll({
      where: sequelize.literal(`timestamp BETWEEN CONVERT(DATETIME, '${startDate}') AND CONVERT(DATETIME, '${endDate}')`)
    });

    res.json({
      success: true,
      data: sensors,
      count: sensors.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la récupération des données des capteurs de lumière',
      details: error.message
    });
  }
});

module.exports = router;