const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const res = require('express/lib/response');
const exerciseRepository = require('./exerciseRepository');
const userRepository = require('./userRepository');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use(express.static('public'));
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

app.post("/api/users", (req, res) => {
  
  const username = getRequiredBodyProperty(req, "username");

  userRepository.createUser(req.body.username, (err, user) => {
    if (err) {
      res.json({ error: `Error creating user "${username}": ${err}`});
      return;
    }

    res.json(user);
  });
});

app.post("/api/users/:userId/exercises", (req, res) => {
  const userId = req.params.userId;
  const description = getRequiredBodyProperty(req, "description");
  const duration = getRequiredBodyProperty(req, "duration");
  const date = req.body.date;

  userRepository.findById(userId, (err, user) => {
    if (err) {
      res.json({ error: `Error getting user with id "${userId}": ${err}`});
      return;
    }

    if (!user) {
      res.json({ error: `User with id "${userId}" does not exist`});
      return;
    }

    exerciseRepository.createExercise(userId, description, duration, date, (err, exercise) => {
      if (err) {
        res.json({ error: `Error creating exercise "${description}": ${err}`});
        return;
      }

      res.json({
        _id: user._id,
        username: user.username,
        description: exercise.description,
        duration: exercise.duration,
        date: exercise.date.toDateString()
      })
    });
  });
});

const getRequiredBodyProperty = (req, propertyName) => {
  const prop = req.body[propertyName];

  if (!prop) {
    res.error({ error: `"${propertyName}" in body request is required` });
    return;
  }

  return prop;
}

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
