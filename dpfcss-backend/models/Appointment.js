const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema(
    {
        patient: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        provider: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            enum: ['follow-up', 'consultation', 'checkup', 'emergency', 'other'],
            default: 'follow-up',
        },
        scheduledDate: {
            type: Date,
            required: true,
        },
        duration: {
            type: Number, // in minutes
            default: 30,
        },
        location: String,
        status: {
            type: String,
            enum: ['scheduled', 'completed', 'missed', 'cancelled', 'rescheduled'],
            default: 'scheduled',
        },
        notes: String,
        reminderSent: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Appointment', appointmentSchema);
