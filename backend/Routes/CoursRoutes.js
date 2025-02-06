const express = require('express');
const router = express.Router();
const coursController = require('../Controllers/CoursController');

// Define endpoints with the full prefix, just like your CompteComptable router
router.post('/api/cours', coursController.createCours);
router.get('/api/cours', coursController.getAllCours);
router.get('/api/cours/:id', coursController.getCoursById);
router.put('/api/cours/:id', coursController.updateCours);
router.delete('/api/cours/:id', coursController.deleteCours);
router.put('/api/cours/:id/enroll', coursController.enrollEtudiant);
router.get('/api/matieres', coursController.getAllMatieres);

module.exports = router;
