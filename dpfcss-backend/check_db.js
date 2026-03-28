const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const checkAllUsers = async () => {
    try {
        const conn = await mongoose.createConnection('mongodb://localhost:27017/admin').asPromise();
        console.log('Connected to admin to list databases...');
        const adminDb = conn.db.admin();
        const dbs = await adminDb.listDatabases();
        
        for (const dbInfo of dbs.databases) {
            const dbName = dbInfo.name;
            if (['admin', 'config', 'local'].includes(dbName)) continue;
            
            console.log(`\n--- Checking DB: ${dbName} ---`);
            const dbConn = await mongoose.createConnection(`mongodb://localhost:27017/${dbName}`).asPromise();
            const collection = dbConn.collection('users');
            const users = await collection.find({}).toArray();
            
            if (users.length > 0) {
                console.log(`Found ${users.length} users in ${dbName}.users`);
                for (const user of users) {
                    console.log(` Email: ${user.email} | Hash Start: ${user.password ? user.password.substring(0, 7) : 'none'} (Full: ${user.password})`);
                    if (user.password && !user.password.startsWith('$2')) {
                        console.log(` [WARNING] Unhashed password found for ${user.email}. Hashing it now...`);
                        const salt = await bcrypt.genSalt(12);
                        const hashedPassword = await bcrypt.hash(user.password, salt);
                        await collection.updateOne({ _id: user._id }, { $set: { password: hashedPassword } });
                        console.log(` [SUCCESS] Updated password in DB: ${dbName}`);
                    }
                }
            } else {
                console.log('No users found.');
            }
            await dbConn.close();
        }
        await conn.close();
        console.log('Done scanning databases.');
    } catch (err) {
        console.error(err);
    }
};

checkAllUsers();
