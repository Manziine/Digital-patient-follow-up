const express = require('express');
const { protect } = require('../middleware/auth');
const Message = require('../models/Message');
const User = require('../models/User');
const Notification = require('../models/Notification');

const router = express.Router();

router.use(protect);

// GET /api/messages/conversations — list of unique conversation partners
router.get('/conversations', async (req, res) => {
    try {
        const messages = await Message.find({
            $or: [{ sender: req.user._id }, { receiver: req.user._id }],
        }).sort('-createdAt');

        const partnerIds = new Set();
        messages.forEach((m) => {
            const otherId = m.sender.toString() === req.user._id.toString()
                ? m.receiver.toString()
                : m.sender.toString();
            partnerIds.add(otherId);
        });

        const partners = await User.find({ _id: { $in: [...partnerIds] } })
            .select('name role specialization hospital');

        // Attach last message to each partner
        const conversations = await Promise.all(
            partners.map(async (partner) => {
                const lastMsg = await Message.findOne({
                    $or: [
                        { sender: req.user._id, receiver: partner._id },
                        { sender: partner._id, receiver: req.user._id },
                    ],
                }).sort('-createdAt');
                const unread = await Message.countDocuments({
                    sender: partner._id,
                    receiver: req.user._id,
                    read: false,
                });
                return { partner, lastMessage: lastMsg, unreadCount: unread };
            })
        );

        res.json(conversations);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET /api/messages/:userId — get chat with specific user
router.get('/:userId', async (req, res) => {
    try {
        const messages = await Message.find({
            $or: [
                { sender: req.user._id, receiver: req.params.userId },
                { sender: req.params.userId, receiver: req.user._id },
            ],
        }).sort('createdAt');

        // Mark messages as read
        await Message.updateMany(
            { sender: req.params.userId, receiver: req.user._id, read: false },
            { read: true, readAt: new Date() }
        );

        res.json(messages);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST /api/messages/:userId — send message
router.post('/:userId', async (req, res) => {
    try {
        const { content } = req.body;
        if (!content || !content.trim()) {
            return res.status(400).json({ message: 'Message content is required' });
        }

        const receiver = await User.findById(req.params.userId);
        if (!receiver) return res.status(404).json({ message: 'Recipient not found' });

        const message = await Message.create({
            sender: req.user._id,
            receiver: req.params.userId,
            content: content.trim(),
        });

        await Notification.create({
            user: req.params.userId,
            type: 'message',
            title: `New message from ${req.user.name}`,
            message: content.length > 60 ? content.substring(0, 60) + '...' : content,
        });

        const populated = await message.populate('sender', 'name role');
        res.status(201).json(populated);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
