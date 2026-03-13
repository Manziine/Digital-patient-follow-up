const express = require('express');
const { protect, restrictTo } = require('../middleware/auth');
const Appointment = require('../models/Appointment');
const Medication = require('../models/Medication');
const Notification = require('../models/Notification');
const HealthContent = require('../models/HealthContent');
const User = require('../models/User');

const router = express.Router();

// All patient routes require auth
router.use(protect);
router.use(restrictTo('patient'));

// GET /api/patients/dashboard
router.get('/dashboard', async (req, res) => {
    try {
        const now = new Date();
        const [appointments, medications, notifications, healthContent] = await Promise.all([
            Appointment.find({ patient: req.user._id, status: 'scheduled', scheduledDate: { $gte: now } })
                .sort('scheduledDate')
                .limit(5)
                .populate('provider', 'name specialization hospital'),
            Medication.find({ patient: req.user._id, isActive: true }),
            Notification.find({ user: req.user._id, read: false }).sort('-createdAt').limit(10),
            HealthContent.find({ isPublished: true }).sort('-createdAt').limit(3),
        ]);

        // Calculate adherence
        const totalDoses = medications.reduce((acc, med) => acc + med.takenLog.length, 0);
        const takenDoses = medications.reduce(
            (acc, med) => acc + med.takenLog.filter((l) => l.taken).length,
            0
        );
        const adherenceRate = totalDoses > 0 ? Math.round((takenDoses / totalDoses) * 100) : 100;

        res.json({ appointments, medications, notifications, healthContent, adherenceRate });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET /api/patients/appointments
router.get('/appointments', async (req, res) => {
    try {
        const appointments = await Appointment.find({ patient: req.user._id })
            .sort('-scheduledDate')
            .populate('provider', 'name specialization hospital phone');
        res.json(appointments);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET /api/patients/medications
router.get('/medications', async (req, res) => {
    try {
        const medications = await Medication.find({ patient: req.user._id })
            .populate('prescribedBy', 'name specialization');
        res.json(medications);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// PATCH /api/patients/medications/:id/take
router.patch('/medications/:id/take', async (req, res) => {
    try {
        const medication = await Medication.findOne({ _id: req.params.id, patient: req.user._id });
        if (!medication) return res.status(404).json({ message: 'Medication not found' });

        medication.takenLog.push({ date: new Date(), taken: true, takenAt: new Date() });
        await medication.save();

        // Create notification for provider
        await Notification.create({
            user: medication.prescribedBy,
            type: 'medication',
            title: 'Medication Taken',
            message: `${req.user.name} has taken their ${medication.name} dose.`,
        });

        res.json({ message: 'Medication marked as taken', medication });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET /api/patients/health-content
router.get('/health-content', async (req, res) => {
    try {
        const content = await HealthContent.find({ isPublished: true })
            .sort('-createdAt')
            .select('title body category imageUrl createdAt');
        res.json(content);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET /api/patients/profile
router.get('/profile', async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate('assignedProvider', 'name specialization hospital phone');
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// PATCH /api/patients/profile
router.patch('/profile', async (req, res) => {
    try {
        const { name, phone, address, gender, dateOfBirth, emergencyContact } = req.body;
        const user = await User.findByIdAndUpdate(
            req.user._id,
            { name, phone, address, gender, dateOfBirth, emergencyContact },
            { new: true, runValidators: true }
        );
        res.json({ message: 'Profile updated', user });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
