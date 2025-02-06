const mongoose = require('mongoose');

const MatiereSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
    },
    
    name: {
        type: String,
        required: true,
    },
}, { autoCreate: true });

const Matiere = mongoose.model('Matiere', MatiereSchema);
module.exports = Matiere;