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

const getExercisesByUserId = (userId, from, to, limit, done) => {
  console.log(limit);

  Exercise.find(
    { userId, date: { $gt: from, $lt: to} }, 
    'description duration date',
    { limit: limit }, 
    done
  );
}

module.exports = {
  createExercise,
  getExercisesByUserId
}