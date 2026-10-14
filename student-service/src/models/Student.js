import mongoose from 'mongoose';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const studentSchema = new mongoose.Schema(
  {
    studentId: {
      type: String,
      required: [true, 'Student ID is required'],
      unique: true,
      trim: true,
      uppercase: true
    },
    name: {
      type: String,
      required: [true, 'Student name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Student email is required'],
      trim: true,
      lowercase: true,
      match: [emailRegex, 'Please provide a valid email address']
    },
    // References to Course IDs (Strings, e.g. ["CS101", "CS102"])
    // Note: In microservices architecture, we store references and do NOT embed full documents
    courseIds: {
      type: [String],
      default: []
    }
  },
  {
    timestamps: true,
    collection: 'students'
  }
);

// Clean JSON transform
studentSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.__v;
    return ret;
  }
});

const Student = mongoose.model('Student', studentSchema);

export default Student;
