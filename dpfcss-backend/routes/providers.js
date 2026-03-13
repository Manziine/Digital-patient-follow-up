const express = require('express');
const { protect, restrictTo } = require('../middleware/auth');
const Appointment = require('../models/Appointment');
const Medication = require('../models/Medication');
const Notification = require('../models/Notification');
const User = require('../models/User');

const router = express.Router();

router.use(protect);
router.use(restrictTo('provider', 'admin'));

// GET /api/providers/dashboard
router.get('/dashboard', async (req, res) => {
    try {
        const now = new Date();
        const oneWeekAhead = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

        const [patients, upcomingAppointments, missedAppointments, medications] = await Promise.all([
            User.find({ assignedProvider: req.user._id, role: 'patient', isActive: true }).select('name email phone lastSeen'),
            Appointment.find({
                provider: req.user._id,
                status: 'scheduled',
                scheduledDate: { $gte: now, $lte: oneWeekAhead },
            }).populate('patient', 'name phone'),
            Appointment.find({ provider: req.user._id, status: 'missed' })
                .sort('-scheduledDate').limit(5).populate('patient', 'name phone'),
            Medication.find({ prescribedBy: req.user._id, isActive: true }).populate('patient', 'name'),
        ]);

        res.json({ patients, upcomingAppointments, missedAppointments, medications });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET /api/providers/patients
router.get('/patients', async (req, res) => {
    try {
        const patients = await User.find({ assignedProvider: req.user._id, role: 'patient' })
            .select('-password');
        res.json(patients);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST /api/providers/patients/register
router.post('/patients/register', restrictTo('provider', 'admin'), async (req, res) => {
    try {
        const { name, email, password, phone, nationalId, address, gender, dateOfBirth } = req.body;
        const existing = await User.findOne({ email });
        if (existing) return res.status(409).json({ message: 'Patient already registered' });

        const patient = await User.create({
            name, email,
            password: password || 'dpfcss@123',
            role: 'patient',
            phone, nationalId, address, gender, dateOfBirth,
            assignedProvider: req.user._id,
        });

        await Notification.create({
            user: patient._id,
            type: 'system',
            title: 'Welcome to DPFCSS',
            message: `Welcome ${name}! Your provider ${req.user.name} has registered you. Please log in with your email.`,
        });

        res.status(201).json({ message: 'Patient registered successfully', patient });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET /api/providers/patients/:id
router.get('/patients/:id', async (req, res) => {
    try {
        const patient = await User.findOne({ _id: req.params.id, assignedProvider: req.user._id });
        if (!patient) return res.status(404).json({ message: 'Patient not found' });
        const [appointments, medications] = await Promise.all([
            Appointment.find({ patient: req.params.id }).sort('-scheduledDate'),
            Medication.find({ patient: req.params.id }),
        ]);
        res.json({ patient, appointments, medications });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST /api/providers/appointments
router.post('/appointments', async (req, res) => {
    try {
        const { patientId, title, type, scheduledDate, duration, location, notes } = req.body;
        const appointment = await Appointment.create({
            patient: patientId,
            provider: req.user._id,
            title, type, scheduledDate, duration, location, notes,
        });

        await Notification.create({
            user: patientId,
            type: 'appointment',
            title: 'New Appointment Scheduled',
            message: `Your follow-up "${title}" is scheduled for ${new Date(scheduledDate).toLocaleDateString()}.`,
        });

        res.status(201).json({ message: 'Appointment created', appointment });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// PATCH /api/providers/appointments/:id
router.patch('/appointments/:id', async (req, res) => {
    try {
        const appointment = await Appointment.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json({ message: 'Appointment updated', appointment });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST /api/providers/medications
router.post('/medications', async (req, res) => {
    try {
        const { patientId, name, dosage, frequency, scheduledTimes, startDate, endDate, instructions } = req.body;
        const medication = await Medication.create({
            patient: patientId,
            prescribedBy: req.user._id,
            name, dosage, frequency, scheduledTimes, startDate, endDate, instructions,
        });

        await Notification.create({
            user: patientId,
            type: 'medication',
            title: 'New Medication Prescribed',
            message: `Dr. ${req.user.name} prescribed ${name} ${dosage}. ${instructions || ''}`,
        });

        res.status(201).json({ message: 'Medication prescribed', medication });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET /api/providers/adherence
router.get('/adherence', async (req, res) => {
    try {
        const medications = await Medication.find({ prescribedBy: req.user._id })
            .populate('patient', 'name');
        const adherenceData = medications.map((med) => {
            const total = med.takenLog.length;
            const taken = med.takenLog.filter((l) => l.taken).length;
            return {
                medicationId: med._id,
                medicationName: med.name,
                patient: med.patient,
                adherencePercent: total > 0 ? Math.round((taken / total) * 100) : 0,
                totalDoses: total,
                missedDoses: total - taken,
            };
        });
        res.json(adherenceData);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET /api/providers/appointments
router.get('/appointments', async (req, res) => {
    try {
        const appointments = await Appointment.find({ provider: req.user._id })
            .sort('-scheduledDate')
            .populate('patient', 'name phone');
        res.json(appointments);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET /api/providers/profile
router.get('/profile', async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// PATCH /api/providers/profile
router.patch('/profile', async (req, res) => {
    try {
        const { name, phone, specialization, hospital, licenseNumber, address } = req.body;
        const user = await User.findByIdAndUpdate(
            req.user._id,
            { name, phone, specialization, hospital, licenseNumber, address },
            { new: true, runValidators: true }
        ).select('-password');
        res.json({ message: 'Profile updated', user });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
