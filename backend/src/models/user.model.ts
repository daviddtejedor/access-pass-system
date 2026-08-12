import mongoose from "mongoose";

const timeRangeSchema = new mongoose.Schema({
  from: { type: Number },
  to: { type: Number }
});

export const UserRole = {
  ADMIN: "ADMIN",
  EMPLOYEE: "EMPLOYEE",
  PASSANT: "PASSANT"
};

const scheduleSchema = new mongoose.Schema({
  weekDay: { type: Number, required: true, min: 0, max: 6 },
  timeRanges: [timeRangeSchema]
});

const userSchema = new mongoose.Schema({
  id: { type: Number, unique: true },
  dni: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  password: { type: String, required: true, select: false }, // Oculta la psd por defecto en consultas
  email: [{ type: String, trim: true, lowercase: true }],
  disabled: { type: Boolean, default: false },
  role: { type: String, enum: Object.values(UserRole), required: true },
  schedule: [scheduleSchema],
  expiresAt: { type: Date, default: undefined }
}, {
  timestamps: true
});

userSchema.pre('save', async function (next) {
  if (this.isNew && !this.id) {  // Solo para documentos nuevos sin ID
    try {
      const lastUser = await ModelUser.findOne().sort({ id: -1 }); // Busca el ID más alto
      this.id = lastUser ? lastUser.id + 1 : 1; // Le suma 1, o usa 1 si es el primero
    } catch (error) {
      return next(error as any);
    }
  }
  next();
});

export const ModelUser = mongoose.model("User", userSchema);