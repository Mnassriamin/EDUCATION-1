// controllers/coursController.js

const Cours = require("../Models/Cours"); // Corrected path
const Matiere = require("../Models/Matiere");
const Prof = require("../Models/Prof");
const Parent = require("../Models/Parent");

// Créer un cours
exports.createCours = async (req, res) => {
  try {
    const { name, description, matiere, datedebut, datefin } = req.body;
    const enseignant = req.user.id; // Assumes req.user is populated by your authentication middleware.
    // req.user will depend on the exact auth middleware you are using

    // Check if matiere exists
    const existingMatiere = await Matiere.findById(matiere);
    if (!existingMatiere) {
      return res.status(404).json({ message: "Matière non trouvée" });
    }

    // Verify that the prof exists
    const existingProf = await Prof.findById(enseignant);
        if (!existingProf) {
            return res.status(404).json({ message: "Professeur non trouvé" });
        }

    const cours = new Cours({
      name,
      description,
      enseignant,
      matiere,
      datedebut,
      datefin,
      etudiants: [], // Initialize the list of students
    });

    const savedCours = await cours.save();
    res.status(201).json(savedCours);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// Récupérer toutes les matières
exports.getAllMatieres = async (req, res) => {
  try {
    const matieres = await Matiere.find();
    res.status(200).json(matieres);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//Get All Profs
exports.getAllProfs = async (req, res) => {
    try {
        const profs = await Prof.find();
        res.status(200).json(profs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

