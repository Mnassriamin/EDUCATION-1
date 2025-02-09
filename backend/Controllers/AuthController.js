const Matiere = require('../Models/Matiere');  // Add this line to import the Matiere model
const Prof = require('../Models/Prof');
const Parent = require('../Models/Parent');
const jwt = require('jsonwebtoken');
const { registerValidation, loginValidation } = require('../Middlewares/AuthValidation');

// Register a Prof
const registerProf = async (req, res) => {
    const { error } = registerValidation(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    try {
        const { name, email, password, telephone, matiereId, etudiants } = req.body;

        const profExists = await Prof.findOne({ email });
        if (profExists) return res.status(400).json({ message: 'Prof already exists' });

        // Validate the matiereId is valid by checking if a Matiere with that ID exists
        const matiereExists = await Matiere.findOne({ id: matiereId });
        if (!matiereExists) return res.status(400).json({ message: 'Invalid Matiere ID' });

        // Create a new Prof
        const newProf = new Prof({
            name,
            email,
            password, // Password will be hashed in the schema middleware
            telephone,
            matiereId, // Validated Matiere ID
            etudiants: etudiants || [] // Default to empty array if not provided
        });

        await newProf.save();
        res.status(201).json({ success: true, message: 'Prof registered successfully', prof: newProf });

    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

// Register a Parent
const registerParent = async (req, res) => {
    const { error } = registerValidation(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    try {
        const parentExists = await Parent.findOne({ email: req.body.email });
        if (parentExists) return res.status(400).json({ message: 'Parent already exists' });

        // Create a new Parent instance explicitly
        const newParent = new Parent({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password, // Password will be hashed in the schema middleware
            telephone: req.body.telephone,
            enfants: req.body.enfants || []
        });

        await newParent.save();
        res.status(201).json({ success: true, message: 'Parent registered successfully' });

    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

// Login a Prof or Parent (Single Function)
const loginUser = async (req, res) => {
    const { error } = loginValidation(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    try {
        const { email, password } = req.body;

        // Search for the user in both collections
        let user = await Prof.findOne({ email }) || await Parent.findOne({ email });
        if (!user) return res.status(401).json({ message: 'Invalid credentials' });

        // Compare passwords
        const isMatch = await user.comparePassword(password);
        if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

        // Determine user type based on existence of `matiereId`
        const userType = user.matiereId ? 'prof' : 'parent';

        // Generate JWT
        const token = jwt.sign(
            { id: user._id, type: userType },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({
            message: `${userType === 'prof' ? 'Prof' : 'Parent'} login successful`,
            token,
            type: userType,
            userId: user._id,
        });

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = { registerProf, registerParent, loginUser };
