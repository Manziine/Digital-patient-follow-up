const mongoose = require('mongoose');

const healthContentSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        body: {
            type: String,
            required: true,
        },
        category: {
            type: String,
            enum: ['nutrition', 'medication', 'hygiene', 'mental_health', 'general', 'covid', 'malaria'],
            default: 'general',
        },
        imageUrl: String,
        tags: [String],
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        isPublished: {
            type: Boolean,
            default: true,
        },
        views: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('HealthContent', healthContentSchema);
