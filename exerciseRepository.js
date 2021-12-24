require('dotenv').config();
const mongoose = require('mongoose');
const { Schema } = mongoose;

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const exerciseSchema = new Schema({
  userId:  { type: String, required: true },
  description: { type: String, required: true },
  duration: { type: Number, required: true },
  date: { type: Date, default: new Date() }
});

const Exercise = mongoose.model("Exercise", exerciseSchema);

const createExercise = (userId, description, duration, date, done) => {
  const exercise = new Exercise({
    userId,
    description,
    duration,
    date
  });

  exercise.save(done);
};

const getExercisesByUserId = (userId, done) => {
  Exercise.find({ userId }, done);
}

module.exports = {
  createExercise,
  getExercisesByUserId
}