const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        type: {
            type: String,
            enum: ['appointment', 'medication', 'message', 'health_tip', 'system'],
            default: 'system',
        },
        title: {
            type: String,
            required: true,
        },
        message: {
            type: String,
            required: true,
        },
        read: {
            type: Boolean,
            default: false,
        },
        link: String, // optional deep link
    },
    { timestamps: true }
);

module.exports = mongoose.model('Notification', notificationSchema);
