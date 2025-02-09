const express = require('express');
const router = express.Router();
const { registerProf, registerParent, loginUser } = require('../Controllers/AuthController'); // Import loginUser

// Routes for registration
router.post('/register/prof', registerProf);
router.post('/register/parent', registerParent);

// Route for login (single route)
router.post('/login', loginUser); // Use loginUser

module.exports = router;