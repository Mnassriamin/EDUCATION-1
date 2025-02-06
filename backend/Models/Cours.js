const mongoose = require('mongoose');

const CoursSchema = new mongoose.Schema({
    // Custom id field (optional; consider removing if you prefer Mongoose's default _id)
    
    name: {
        type: String,
        required: true,
    },
    matiere: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Matiere',
        required: true,
    },
    enseignant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    datedebut: {
        type: Date,
        required: true,
    },
    datefin: {
        type: Date,
        required: true,
    },
    etudiants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
}, { timestamps: true });

const Cours = mongoose.model('Cours', CoursSchema);
module.exports = Cours;
