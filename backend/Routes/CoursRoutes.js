// routes/CoursRoutes.js
const express = require('express');
const router = express.Router();
const coursController = require('../Controllers/CoursController'); // Corrected path

// Route pour créer un cours (nécessite une authentification)
router.post('/api/cours', coursController.createCours); // Example: Requires authentication

// Route pour récupérer toutes les matières
router.get('/api/matieres', coursController.getAllMatieres);

//Get All Profs
router.get('/api/profs', coursController.getAllProfs);

module.exports = router;
