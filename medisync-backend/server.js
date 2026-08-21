require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const connectDb = require('./config/db');
const authRoutes=require('./routes/authRoutes');
const doctorRoutes=require('./routes/doctorRoutes');
const slotRoutes=require('./routes/slotRoutes');
const appointmentRoutes=require('./routes/appointmentRoutes')
const symptomRoutes=require('./routes/symptomRoutes');
const app = express();
app.use(cors());
connectDb();
mongoose.connection.once('open', () => {
  console.log('Connected to database:', mongoose.connection.name);
});
app.use(express.json());
app.use('/api/auth',authRoutes);
app.use('/api/doctors',doctorRoutes);

app.use('/api/slots',slotRoutes);
app.use('/api/appointments',appointmentRoutes);
app.use('/api/symptoms',symptomRoutes);
const PORT = process.env.PORT || 5000;
// TEMP DEBUG - List available Gemini models
app.get('/api/debug/models', async (req, res) => {
    try {
        const { GoogleGenerativeAI } = require('@google/generative-ai');
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        
        // Try with v1 instead of v1beta
        const response = await fetch(
            'https://generativelanguage.googleapis.com/v1/models?key=' + process.env.GEMINI_API_KEY
        );
        const data = await response.json();
        
        // Filter for models that support generateContent
        const models = data.models || [];
        const supportedModels = models.filter(m => 
            m.supportedGenerationMethods?.includes('generateContent')
        );
        
        res.json({
            totalModels: models.length,
            supportedModels: supportedModels.map(m => m.name)
        });
    } catch (error) {
        res.json({ error: error.message });
    }
});
app.get('/api/test', (req, res) => {
    res.json({ message: "API is working" });
});
app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`)
});