require('dotenv').config();
const express = require('express');
const connectToDatabase = require('../backend/Models/db');
const authRouter = require('./Routes/AuthRouter');
const journalRoutes = require('./Routes/journalRoutes');
const CompteComptable = require('./Routes/CompteComptableRoutes');
const coursRoutes = require('./Routes/CoursRoutes');
const cors = require('cors');

const app = express();
// Autoriser toutes les origines
app.use(cors());

// Middleware
app.use(express.json());
app.use(cors());
// Connexion à MongoDB
connectToDatabase();

// Routes
app.use('/api/auth', authRouter);
app.use('/', journalRoutes);
app.use('/', CompteComptable);
app.use('/', coursRoutes);

// Démarrer le serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`✅ Serveur démarré sur le port ${PORT}`);
});
