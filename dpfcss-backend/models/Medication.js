const mongoose = require('mongoose');

const medicationSchema = new mongoose.Schema(
    {
        patient: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        prescribedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        dosage: {
            type: String,
            required: true,
        },
        frequency: {
            type: String,
            enum: ['once_daily', 'twice_daily', 'three_times_daily', 'as_needed', 'weekly'],
            default: 'once_daily',
        },
        scheduledTimes: [String], // e.g. ["08:00", "20:00"]
        startDate: {
            type: Date,
            required: true,
        },
        endDate: Date,
        instructions: String,
        isActive: {
            type: Boolean,
            default: true,
        },
        takenLog: [
            {
                date: Date,
                taken: Boolean,
                takenAt: Date,
            },
        ],
    },
    { timestamps: true }
);

module.exports = mongoose.model('Medication', medicationSchema);
