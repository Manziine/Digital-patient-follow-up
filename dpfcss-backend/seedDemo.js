const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./models/User');
const Appointment = require('./models/Appointment');
const Message = require('./models/Message');

const seedDemoData = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/dpfcss');
        console.log('MongoDB connected for seeding...');

        await User.deleteMany({ email: { $in: ['patient@demo.com', 'provider@demo.com', 'admin@demo.com'] } });

        const provider = await User.create({
            name: 'Dr. Habimana Eric',
            email: 'provider@demo.com',
            password: 'Demo123',
            role: 'provider',
            specialization: 'General Practitioner',
            hospital: 'CHUK Kigali',
            phone: '+250 788 987 654',
            avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
        });

        const patient = await User.create({
            name: 'Uwase Aline',
            email: 'patient@demo.com',
            password: 'Demo123',
            role: 'patient',
            phone: '+250 788 123 456',
            gender: 'female',
            dateOfBirth: new Date(1992, 5, 15),
            address: 'Kigali, Rwanda',
            nationalId: '1 1992 8 0000000 1 00',
            avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
            assignedProvider: provider._id
        });

        const admin = await User.create({
            name: 'Niyonzima Patrick',
            email: 'admin@demo.com',
            password: 'Demo123',
            role: 'admin',
            phone: '+250 788 111 222',
            avatar: 'https://randomuser.me/api/portraits/men/65.jpg'
        });

        await Appointment.deleteMany({});
        await Appointment.create({
            patient: patient._id,
            provider: provider._id,
            title: 'Post-Discharge Follow-Up',
            type: 'follow-up',
            scheduledDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
            duration: 30,
            location: 'Telehealth / DPFCSS Chat',
            status: 'scheduled'
        });

        await Message.deleteMany({});
        await Message.create([
            {
                sender: patient._id,
                receiver: provider._id,
                content: 'Hello Dr. Habimana, I am experiencing slight dizziness after my new medication. Is this normal?',
                read: true,
                createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000)
            },
            {
                sender: provider._id,
                receiver: patient._id,
                content: 'Hello Uwase. Yes, mild dizziness is normal for the first day, but if it persists tomorrow, please message me here immediately and we will adjust your dose.',
                read: false
            }
        ]);

        console.log('Demo accounts, appointments, and messages seeded successfully!');
    } catch (err) {
        console.error(err);
    } finally {
        process.exit();
    }
};

seedDemoData();
