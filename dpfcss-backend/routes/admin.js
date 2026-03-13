const express = require('express');
const { protect, restrictTo } = require('../middleware/auth');
const User = require('../models/User');
const Appointment = require('../models/Appointment');
const Medication = require('../models/Medication');
const Message = require('../models/Message');
const HealthContent = require('../models/HealthContent');

const router = express.Router();

router.use(protect);
router.use(restrictTo('admin'));

// GET /api/admin/dashboard
router.get('/dashboard', async (req, res) => {
    try {
        const [totalUsers, totalPatients, totalProviders, totalAppointments, totalMessages, recentUsers] = await Promise.all([
            User.countDocuments(),
            User.countDocuments({ role: 'patient' }),
            User.countDocuments({ role: 'provider' }),
            Appointment.countDocuments(),
            Message.countDocuments(),
            User.find().sort('-createdAt').limit(10).select('-password'),
        ]);

        // Monthly appointment stats (last 6 months)
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const appointmentStats = await Appointment.aggregate([
            { $match: { createdAt: { $gte: sixMonthsAgo } } },
            {
                $group: {
                    _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
                    count: { $sum: 1 },
                    completed: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] } },
                    missed: { $sum: { $cond: [{ $eq: ['$status', 'missed'] }, 1, 0] } },
                },
            },
            { $sort: { '_id.year': 1, '_id.month': 1 } },
        ]);

        res.json({
            stats: { totalUsers, totalPatients, totalProviders, totalAppointments, totalMessages },
            appointmentStats,
            recentUsers,
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET /api/admin/users
router.get('/users', async (req, res) => {
    try {
        const { role, page = 1, limit = 20, search } = req.query;
        const query = {};
        if (role) query.role = role;
        if (search) query.name = { $regex: search, $options: 'i' };

        const users = await User.find(query)
            .select('-password')
            .skip((page - 1) * limit)
            .limit(Number(limit))
            .sort('-createdAt');
        const total = await User.countDocuments(query);

        res.json({ users, total, pages: Math.ceil(total / limit), currentPage: Number(page) });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// PATCH /api/admin/users/:id
router.patch('/users/:id', async (req, res) => {
    try {
        const { isActive, role } = req.body;
        const user = await User.findByIdAndUpdate(req.params.id, { isActive, role }, { new: true }).select('-password');
        res.json({ message: 'User updated', user });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// DELETE /api/admin/users/:id
router.delete('/users/:id', async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: 'User deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET /api/admin/health-content
router.get('/health-content', async (req, res) => {
    try {
        const content = await HealthContent.find().sort('-createdAt').populate('createdBy', 'name');
        res.json(content);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST /api/admin/health-content
router.post('/health-content', async (req, res) => {
    try {
        const { title, body, category, imageUrl, tags } = req.body;
        const content = await HealthContent.create({ title, body, category, imageUrl, tags, createdBy: req.user._id });
        res.status(201).json({ message: 'Health content created', content });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// DELETE /api/admin/health-content/:id
router.delete('/health-content/:id', async (req, res) => {
    try {
        await HealthContent.findByIdAndDelete(req.params.id);
        res.json({ message: 'Content deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
