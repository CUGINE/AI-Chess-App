const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const mongoose = require('mongoose');

const rawUrl = (process.env.MONGODB_URL || '').trim();
const baseUrl = rawUrl.replace(/\/+$/, '');

// Format clean Atlas connection string with dbName and retryWrites
let connectUri;
if (baseUrl.includes('mongodb+srv://') || baseUrl.includes('mongodb://')) {
    if (!baseUrl.includes('/aichessdb')) {
        connectUri = `${baseUrl}/aichessdb?retryWrites=true&w=majority`;
    } else {
        connectUri = baseUrl;
    }
} else {
    connectUri = baseUrl;
}

console.log('>>> [MongoDB] Attempting connection...');

mongoose.connect(connectUri, {
    serverSelectionTimeoutMS: 5000,
})
.then(() => {
    console.log('>>> [MongoDB] Connected successfully to aichessdb');
})
.catch((err) => {
    console.error('>>> [MongoDB] Connection error details:', err.message);
});

mongoose.connection.on('disconnected', () => {
    console.warn('>>> [MongoDB] Disconnected from database');
});

module.exports = mongoose;
