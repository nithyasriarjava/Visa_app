import mongoose from 'mongoose'

const visaApplicationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  personalDetails: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    sex: { type: String, required: true },
    maritalStatus: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    emergencyContactName: { type: String, required: true },
    emergencyContactPhone: { type: String, required: true },
    employmentStartDate: { type: Date, required: true }
  },
  addressDetails: {
    streetName: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zip: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date }
  },
  h1bDetails: {
    clientName: { type: String, required: true },
    clientStreet: { type: String, required: true },
    clientCity: { type: String, required: true },
    clientState: { type: String, required: true },
    clientZip: { type: String, required: true },
    lcaTitle: { type: String, required: true },
    lcaSalary: { type: Number, required: true },
    lcaCode: { type: String, required: true },
    receiptNumber: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true }
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  }
}, {
  timestamps: true
})

export default mongoose.model('VisaApplication', visaApplicationSchema)