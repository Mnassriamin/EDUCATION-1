const Cours = require('../Models/Cours');
const Matiere = require('../Models/Matiere'); // Ensure this path is correct

// Créer un cours
exports.createCours = async (req, res) => {
    try {
        const cours = new Cours(req.body);
        const savedCours = await cours.save();
        res.status(201).json(savedCours);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Récupérer tous les cours
exports.getAllCours = async (req, res) => {
    try {
        const userRole = req.query.role; // Get user role from request query
        const userId = req.query.userId; // Get user ID from request query

        let filter = {}; 

        if (userRole === "enseignant") {
            filter.enseignant = userId; // Show only courses created by the teacher
        }

        const cours = await Cours.find(filter)
            .populate('matiere', 'name') // Populate Matière name
            .populate('enseignant', 'name') // Populate Teacher name
            .populate('etudiants', 'name email'); // Populate Enrolled Students' Names & Emails

        res.status(200).json(cours);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// Récupérer un cours par ID
exports.getCoursById = async (req, res) => {
    try {
        const cours = await Cours.findById(req.params.id);
        if (!cours) {
            return res.status(404).json({ message: 'Cours non trouvé' });
        }
        res.status(200).json(cours);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Mettre à jour un cours
exports.updateCours = async (req, res) => {
    try {
        const updatedCours = await Cours.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!updatedCours) {
            return res.status(404).json({ message: 'Cours non trouvé' });
        }
        res.status(200).json(updatedCours);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Supprimer un cours
exports.deleteCours = async (req, res) => {
    try {
        const deletedCours = await Cours.findByIdAndDelete(req.params.id);
        if (!deletedCours) {
            return res.status(404).json({ message: 'Cours non trouvé' });
        }
        res.status(200).json({ message: 'Cours supprimé avec succès' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Ajouter un étudiant (enrollment) dans un cours
exports.enrollEtudiant = async (req, res) => {
    try {
        const { etudiantId } = req.body; // Expecting { etudiantId: '...' } in the request body
        const cours = await Cours.findByIdAndUpdate(
            req.params.id,
            { $addToSet: { etudiants: etudiantId } }, // $addToSet avoids duplicate entries
            { new: true }
        );
        if (!cours) {
            return res.status(404).json({ message: 'Cours non trouvé' });
        }
        res.status(200).json(cours);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// NEW: Récupérer toutes les matières
exports.getAllMatieres = async (req, res) => {
    try {
        const matieres = await Matiere.find();
        res.status(200).json(matieres);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
