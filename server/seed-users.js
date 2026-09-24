require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User.js');

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  await User.deleteMany({ email: { $in: ['testuser@example.com', 'admin@example.com'] } });
  await User.create({ name: 'Test User', email: 'testuser@example.com', password: 'Test@1234', role: 'member' });
  await User.create({ name: 'Admin User', email: 'admin@example.com', password: 'Admin@1234', role: 'admin' });
  console.log('Seeded exact test credentials!');
  process.exit(0);
});
