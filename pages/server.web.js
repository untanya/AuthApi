const express = require('express');
const path = require('path');

const router = express.Router();

// Route pour servir la page HTML avec le graphique
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/index.html'));
});

module.exports = router;
