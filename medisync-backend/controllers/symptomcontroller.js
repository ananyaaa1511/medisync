const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const checkSymptoms = async (req, res) => {
    try {
        const { symptoms, age, gender, additionalNotes, duration } = req.body;

        // Validation
        if (!symptoms || typeof symptoms !== 'string' || symptoms.trim().length === 0) {
            return res.status(400).json({ 
                message: 'Please describe your symptoms in text format' 
            });
        }

        if (symptoms.length < 10) {
            return res.status(400).json({ 
                message: 'Please provide more detail about your symptoms (at least 10 characters)' 
            });
        }

        if (symptoms.length > 1000) {
            return res.status(400).json({ 
                message: 'Please limit your description to 1000 characters' 
            });
        }

        // Build the prompt for Gemini
        const prompt = `You are a medical AI assistant helping with preliminary symptom analysis. 
        
        Patient Information:
        - Age: ${age || 'Not provided'}
        - Gender: ${gender || 'Not provided'}
        - Symptoms description: "${symptoms}"
        - Duration: ${duration || 'Not provided'}
        - Additional notes: ${additionalNotes || 'None'}

        Please provide a structured analysis in the following JSON format ONLY (no other text):
        {
            "possibleConditions": [
                {
                    "name": "Condition name",
                    "probability": "High/Medium/Low",
                    "reasoning": "Why this matches the symptoms",
                    "urgencyLevel": "Emergency/Urgent/Non-urgent",
                    "recommendedAction": "What the patient should do"
                }
            ],
            "generalAdvice": "Overall health advice based on symptoms",
            "redFlags": ["Any emergency warning signs to watch for"],
            "disclaimer": "⚠️ This is AI-generated analysis, not a medical diagnosis. Please consult a healthcare professional."
        }

        Important rules:
        - List 2-4 possible conditions, sorted by likelihood
        - If symptoms suggest emergency (chest pain, stroke signs, severe bleeding, etc.), mark as "Emergency" and advise immediate medical attention
        - Be conservative - when in doubt, recommend seeing a doctor
        - Do NOT prescribe medication - only suggest seeing a doctor
        - Return ONLY valid JSON, no markdown, no code blocks, no extra text`;

        // Get the Gemini model
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

        // Generate response
        const result = await model.generateContent(prompt);
        const response = result.response;
        let text = response.text();

        // Clean the response - remove markdown code blocks if present
        text = text.replace(/```json/g, '').replace(/```/g, '').trim();

        // Parse the JSON response
        let analysis;
        try {
            analysis = JSON.parse(text);
        } catch (parseError) {
            // If JSON parsing fails, return raw text
            return res.status(200).json({
                rawAnalysis: text,
                disclaimer: '⚠️ This is AI-generated analysis, not a medical diagnosis. Please consult a healthcare professional.'
            });
        }

        // Add patient info to response
        analysis.patientInfo = {
            age: age || 'Not provided',
            gender: gender || 'Not provided',
            symptoms: symptoms,
            duration: duration || 'Not provided'
        };

        res.status(200).json(analysis);

    } catch (error) {
        console.error('Gemini API Error:', error);
        
        if (error.message.includes('API key')) {
            return res.status(500).json({ 
                message: 'AI service configuration error. Please check API key.' 
            });
        }
        
        res.status(500).json({ 
            message: 'Error analyzing symptoms. Please try again.',
            error: error.message 
        });
    }
};

// Get AI health tips based on a query
const getHealthTip = async (req, res) => {
    try {
        const { query } = req.body;

        if (!query || query.trim().length === 0) {
            return res.status(400).json({ message: 'Please provide a health question' });
        }

        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
        
        const prompt = `As a medical AI assistant, provide a brief, helpful response to this health question: "${query}"
        
        Rules:
        - Keep response under 200 words
        - Include a disclaimer that this is not medical advice
        - Do NOT prescribe medication
        - If it's an emergency, advise immediate medical attention`;

        const result = await model.generateContent(prompt);
        const response = result.response;

        res.status(200).json({
            query: query,
            response: response.text(),
            disclaimer: '⚠️ This is AI-generated information, not medical advice. Consult a healthcare professional.'
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// AI Symptom Analyzer
const analyzeSymptoms = async (req, res) => {
    try {
        const { symptoms } = req.body;

        // 1. Validate that symptoms were provided
        if (!symptoms || typeof symptoms !== 'string' || symptoms.trim().length === 0) {
            return res.status(400).json({ 
                message: 'Please describe your symptoms first.' 
            });
        }

        // 2. Build AI prompt instructing model to behave as a healthcare information assistant
        const prompt = `You are a medical AI health information assistant. Analyze the following patient symptoms.
        
        Symptoms: "${symptoms}"

        Please provide a structured analysis in the following JSON format ONLY:
        {
            "possibleConditions": ["Condition A", "Condition B", "Condition C"],
            "recommendedSpecialty": "Recommended Doctor Specialty (e.g. Cardiologist, Dermatologist, General Physician)",
            "advice": ["Self-care advice 1", "Self-care advice 2"],
            "warningSigns": ["Emergency warning sign 1", "Emergency warning sign 2"],
            "disclaimer": "This information is for educational purposes only and is not a medical diagnosis. Please consult a qualified healthcare professional."
        }

        Rules:
        - Analyze the symptoms provided.
        - Give 2-4 possible causes/conditions. Use non-definitive language like "Possible causes may include...".
        - Recommend an appropriate medical specialty.
        - Give general self-care guidance where appropriate.
        - Identify warning signs that require urgent medical attention.
        - Clearly state that the result is not a medical diagnosis.
        - Encourage the user to consult a qualified healthcare professional.
        - Do NOT make definitive diagnostic statements.
        - Do NOT prescribe prescription medications or give dangerous medical instructions.
        - Return ONLY valid JSON. No markdown code blocks, no other text.`;

        // 3. Get model and call Gemini
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
        
        const result = await model.generateContent(prompt);
        const response = result.response;
        let text = response.text();

        // Clean JSON formatting from markdown response
        text = text.replace(/```json/g, '').replace(/```/g, '').trim();

        // 4. Parse response safely
        let analysis;
        try {
            analysis = JSON.parse(text);
        } catch (parseError) {
            console.error("JSON Parsing failed for Gemini output:", text);
            return res.status(200).json({
                possibleConditions: ["Unable to parse conditions"],
                recommendedSpecialty: "General Physician",
                advice: ["Rest and hydrate", "Consult a doctor for detailed analysis"],
                warningSigns: ["Any severe or worsening symptoms require immediate care"],
                disclaimer: "This information is for educational purposes only and is not a medical diagnosis."
            });
        }

        res.status(200).json(analysis);

    } catch (error) {
        console.error('Gemini API Error:', error);
        
        if (error.message.includes('API key')) {
            return res.status(500).json({ 
                message: 'AI service configuration error. Please check API key.' 
            });
        }
        
        res.status(500).json({ 
            message: 'Unable to analyze symptoms right now. Please try again.'
        });
    }
};

module.exports = { checkSymptoms, getHealthTip, analyzeSymptoms };