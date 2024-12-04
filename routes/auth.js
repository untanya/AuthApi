const express = require('express');
const router = express.Router();
const User = require('../models/users.model');
const logger = require('../utils/logger');

// Récupérer tous les utilisateurs
router.get('/', async (req, res) => {
    try {
        const users = await User.findAll();
        logger.info('Utilisateurs récupérés avec succès', { count: users.length });
        
        res.json({
            success: true,
            data: users,
            message: 'Utilisateurs récupérés avec succès'
        });
    } catch (error) {
        logger.error('Erreur lors de la récupération des utilisateurs', error);
        res.status(500).json({
            success: false,
            error: 'Erreur lors de la récupération des utilisateurs',
            details: error.message
        });
    }
});

// Récupérer un utilisateur par ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        if (isNaN(id)) {
            return res.status(400).json({
                success: false,
                error: 'ID invalide',
                details: 'L\'ID doit être un nombre'
            });
        }

        const user = await User.findByPk(id);

        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'Utilisateur non trouvé',
                details: `Aucun utilisateur trouvé avec l'ID ${id}`
            });
        }

        logger.info('Utilisateur récupéré avec succès', { id });
        
        res.json({
            success: true,
            data: user,
            message: 'Utilisateur récupéré avec succès'
        });
    } catch (error) {
        logger.error('Erreur lors de la récupération de l\'utilisateur', error);
        res.status(500).json({
            success: false,
            error: 'Erreur lors de la récupération de l\'utilisateur',
            details: error.message
        });
    }
});

module.exports = router;