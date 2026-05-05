import express from 'express';
import { symptomMatch, smartSlots, generatePrescription, chatAssistant } from '../controllers/aiController.js';

const aiRouter = express.Router();

aiRouter.post('/symptom-match', symptomMatch);
aiRouter.post('/smart-slots', smartSlots);
aiRouter.post('/generate-prescription', generatePrescription);
aiRouter.post('/chat', chatAssistant);

export default aiRouter;
