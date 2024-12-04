const express = require('express');
const router = express.Router();
const Sensor = require('../models/sensors.model');

// Route pour récupérer tous les capteurs
router.get('/', async (req, res) => {
    try {
        const sensors = await Sensor.findAll({
            attributes: ['id', 'name', 'location']
        });

        res.json({
            success: true,
            data: sensors,
            count: sensors.length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Erreur lors de la récupération des capteurs',
            details: error.message
        });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const sensor = await Sensor.findByPk(req.params.id, {
            attributes: ['id', 'name', 'location']
        });

        if (!sensor) {
            return res.status(404).json({
                success: false,
                error: 'Capteur non trouvé',
                details: `Aucun capteur trouvé avec l'ID: ${req.params.id}`
            });
        }

        res.json({
            success: true,
            data: sensor
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Erreur lors de la récupération du capteur',
            details: error.message
        });
    }
});

module.exports = router;