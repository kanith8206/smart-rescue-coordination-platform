import mongoose from 'mongoose';

const incidentSchema = new mongoose.Schema({
  id: { type: Number, required: false }, // Keeping id for backward compatibility with frontend if needed, though _id is better
  type: { type: String, required: true },
  lat: { type: Number, required: true },
  lng: { type: Number, required: true },
  severity: { type: String, required: true, enum: ['low', 'moderate', 'high', 'critical'] },
  status: { type: String, required: true, default: 'pending', enum: ['pending', 'active', 'resolved'] },
  reporter: { type: String, required: true },
  description: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

// Auto-increment simple id for the mock-like compatibility if needed
incidentSchema.pre('save', async function(next: any) {
  const doc = this as any;
  if (!doc.id) {
    const lastIncident = await mongoose.model('Incident').findOne().sort({ id: -1 }) as any;
    doc.id = lastIncident && lastIncident.id ? lastIncident.id + 1 : 1;
  }
  next();
});

export const Incident = mongoose.model('Incident', incidentSchema);
