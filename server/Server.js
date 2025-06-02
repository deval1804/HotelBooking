import express from 'express';
import mongoose from 'mongoose';
import { Webhook } from 'svix';
import User from './models/User.js';
import dotenv from 'dotenv';

// Initialize Express app
const app = express();
dotenv.config();

// Middleware to get raw body for webhook verification
app.use(express.json({
  verify: (req, res, buf) => {
    req.rawBody = buf.toString();
  }
}));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB Connection Error:', err));

// Webhook Endpoint
app.post('/api/clerk', async (req, res) => {
  try {
    const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET);
    const payload = wh.verify(req.rawBody, req.headers);
    
    console.log("Received Clerk webhook:", payload.type);

    switch (payload.type) {
      case 'user.created':
        const emailObj = payload.data.email_addresses.find(
          email => email.id === payload.data.primary_email_address_id
        );
        
        const newUser = new User({
          clerkId: payload.data.id,
          username: payload.data.username || emailObj.email_address.split('@')[0],
          email: emailObj.email_address,
          firstName: payload.data.first_name,
          lastName: payload.data.last_name,
          image: payload.data.image_url,
          role: 'user'
        });

        await newUser.save();
        console.log("Created new user:", newUser);
        break;

      case 'user.updated':
        await User.findOneAndUpdate(
          { clerkId: payload.data.id },
          {
            username: payload.data.username,
            firstName: payload.data.first_name,
            lastName: payload.data.last_name,
            image: payload.data.image_url
          }
        );
        break;

      case 'user.deleted':
        await User.findOneAndDelete({ clerkId: payload.data.id });
        break;
    }

    res.status(200).json({ success: true });
  } catch (err) {
    console.error("Webhook error:", err);
    res.status(400).json({ error: err.message });
  }
});

// Start Server on PORT 5000
const PORT = process.env.PORT || 5000; // Changed from 10000 to 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});