require('dotenv').config();
const mongoose = require('mongoose');
const { Schema } = mongoose;

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const userSchema = new Schema({
  username:  { type: String, required: true },
});

const User = mongoose.model("User", userSchema);

const createUser = (username, done) => {
  const user = new User({
    username
  });

  user.save(done);
};

const getUsers = (done) => {
  User.find({}, done);
}

const findById = (id, done) => {
  User.findById(id, done);
};

const findByUsername = (username, done) => {
  User.findOne({username}, done);
}

module.exports = {
  createUser,
  getUsers,
  findById,
  findByUsername
}