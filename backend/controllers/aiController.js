import aiManager from '../services/aiManager.js';
import doctorModel from '../models/doctorModel.js';

const specialties = ['General physician', 'Gynecologist', 'Dermatologist', 'Pediatricians', 'Neurologist', 'Gastroenterologist', 'Psychiatrist', 'Cardiologist', 'Orthopedist', 'Urologist', 'Ophthalmologist'];

const symptomMatch = async (req, res) => {
    try {
        const { symptoms } = req.body;
        if (!symptoms) return res.json({ success: false, message: 'Symptoms required' });

        const prompt = `You are a medical diagnostic assistant for Sheba Diagnostic Center.
        Analyze these symptoms: "${symptoms}"
        
        Available departments: ${specialties.join(', ')}.

        Respond ONLY with a valid JSON object in this format:
        {
          "department": "Department Name",
          "keywords": ["symptom1", "symptom2"],
          "reasoning": "Brief explanation"
        }`;

        const result = await aiManager.generateContentWithRetry(prompt);
        let text = result.response.text();

        // Robust JSON extraction
        let aiResponse;
        try {
            // Find the first { and last } to extract JSON
            const start = text.indexOf('{');
            const end = text.lastIndexOf('}');
            if (start === -1 || end === -1) throw new Error("No JSON found");
            const jsonStr = text.substring(start, end + 1);
            aiResponse = JSON.parse(jsonStr);
        } catch (e) {
            console.error("AI Response Parsing Failed. Raw text:", text);
            // Fallback: simple keyword matching if AI fails
            const foundDept = specialties.find(s => text.toLowerCase().includes(s.toLowerCase())) || "General physician";
            aiResponse = { department: foundDept, keywords: [], reasoning: "Automated department matching based on symptoms." };
        }

        // Use case-insensitive regex for department matching
        const doctors = await doctorModel.find({ 
            speciality: { $regex: new RegExp(`^${aiResponse.department}$`, 'i') } 
        });

        res.json({ success: true, aiResponse, doctors });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};

const smartSlots = async (req, res) => {
    try {
        const { docId } = req.body;
        const doctor = await doctorModel.findById(docId);
        if (!doctor) return res.json({ success: false, message: 'Doctor not found' });

        // Simple logic: Find the first day with an available slot
        const sessions = [
            { startHour: 9, endHour: 13 },
            { startHour: 16, endHour: 19 }
        ];
        const now = new Date();
        let suggestion = null;

        for (let i = 0; i < 7; i++) {
            const date = new Date(now);
            date.setDate(now.getDate() + i);
            const slotDate = `${date.getDate()}_${date.getMonth() + 1}_${date.getFullYear()}`;
            const booked = doctor.slots_booked[slotDate] || [];

            for (const session of sessions) {
                for (let h = session.startHour; h < session.endHour; h++) {
                    for (let m of ['00', '30']) {
                        const timeStr = `${h === 12 ? 12 : h % 12}:${m} ${h >= 12 ? 'PM' : 'AM'}`;
                        if (!booked.includes(timeStr)) {
                            suggestion = { dayIndex: i, time: timeStr };
                            break;
                        }
                    }
                    if (suggestion) break;
                }
                if (suggestion) break;
            }
            if (suggestion) break;
        }

        res.json({ success: true, message: 'Smart slots calculated', suggestion });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
}

const generatePrescription = async (req, res) => {
    try {
        const { notes } = req.body;
        if (!notes) return res.json({ success: false, message: 'Notes required' });

        const prompt = `Convert these rough doctor notes into a structured digital prescription: "${notes}". 
        Respond ONLY with a valid JSON object in this format:
        {
          "medicines": [{"name": "Medicine Name", "dosage": "e.g. 1-0-1", "duration": "5 days"}],
          "advice": "General health advice",
          "followUp": "When to see again"
        }`;

        const result = await aiManager.generateContentWithRetry(prompt);
        let text = result.response.text();

        // Robust JSON extraction
        let prescription;
        try {
            const start = text.indexOf('{');
            const end = text.lastIndexOf('}');
            if (start === -1 || end === -1) throw new Error("No JSON found");
            const jsonStr = text.substring(start, end + 1);
            prescription = JSON.parse(jsonStr);
        } catch (e) {
            console.error("Prescription AI Parsing Failed. Raw text:", text);
            // Fallback object
            prescription = { 
                medicines: [{ name: "Review notes", dosage: "N/A", duration: "N/A" }], 
                advice: "Manual review required: " + text.slice(0, 100), 
                followUp: "Consult doctor" 
            };
        }

        res.json({ success: true, prescription });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};

const chatAssistant = async (req, res) => {
    try {
        const { history, message } = req.body;
        if (!message) return res.json({ success: false, message: 'Message required' });

        // Fetch available doctors
        const doctors = await doctorModel.find({}).select('name speciality _id');
        const doctorListText = doctors.map(doc => `- Dr. ${doc.name} (${doc.speciality}) [ID: ${doc._id}]`).join('\n');

        const systemPrompt = `You are "Sheba AI", the official expert assistant for the Sheba Diagnostic Center.
Your goal is to provide detailed information about our facility, help users navigate the website, and recommend doctors from our clinic.

### PLATFORM DETAILS (YOUR KNOWLEDGE BASE):
- **Name**: Sheba Diagnostic Center
- **Mission**: To redefine medical excellence by integrating advanced diagnostic technologies with world-renowned medical expertise.
- **Location**: House 12, Road 4, Dhanmondi, Dhaka, Bangladesh.
- **Contact**: Phone: +880 1234-567890 | Email: support@sheba.com
- **Emergency**: We have a 24/7 Clinical Emergency Ward with immediate medical assistance.
- **Visiting Hours**: 10:00 AM to 8:00 PM daily. Specialized departments may have restrictions.
- **Core Values**: Clinical Efficiency (minimal wait times), Elite Professionals (curated network), and Advanced Diagnostics (in-house labs).
- **Booking & Services**:
    - Users can book appointments for General Physicians, Cardiologists, Neurologists, Pediatricians, etc.
    - **Teleconsultation Discount**: We offer a 30% discount for online consultations.
    - **Reports**: Diagnostic reports are available for download directly from the Patient Dashboard under "My Appointments" once processed.
- **Payments**: We accept Stripe, Razorpay, and Aamarpay.

### AVAILABLE DOCTORS AT SHEBA DIAGNOSTIC CENTER:
${doctorListText}

### OPERATIONAL RULES:
1. **STRICT TOPICALITY**: You ONLY answer questions related to Sheba Diagnostic Center, our medical services, doctors, or diagnostic processes.
2. **OFF-TOPIC REJECTION**: If a user asks about anything unrelated (e.g., weather, sports, cooking, general coding, non-medical advice outside our scope), you MUST reply with this exact sweet message: "I'm sorry, but I can only assist with questions related to Sheba Diagnostic Center and our medical services. 🌸 Please ask me anything related to the website!"
3. **TONE**: Professional, empathetic, and knowledgeable.
4. **RECOMMENDATIONS**: When symptoms match a doctor's specialty, recommend them using a clickable markdown link: [Book Dr. Name](/appointment/DOCTOR_ID_HERE).
5. **ACCURACY**: Never make up details or doctors. Use the provided list.`;

        // Using Singleton to start chat
        const chat = aiManager.startChatSession(
            (history || []).map(msg => ({
                role: msg.role === 'ai' ? 'model' : 'user',
                parts: [{ text: msg.text }]
            })).filter((msg, idx, arr) => {
                // Ensure first message is from user for Gemini
                if (idx === 0 && msg.role === 'model') return false;
                return true;
            }),
            { systemInstruction: systemPrompt }
        );

        const result = await aiManager.sendMessageWithRetry(chat, message);
        const text = result.response.text();

        res.json({ success: true, response: text });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};

export { symptomMatch, smartSlots, generatePrescription, chatAssistant };
