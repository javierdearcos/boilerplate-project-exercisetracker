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

app.get("/api/users", (_, res) => {

  userRepository.getUsers((err, users) => {
    if (err) {
      res.json({ error: `Error getting users: ${err}`});
      return;
    }

    res.json(users);
  })
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
  const date = req.body.date || new Date();

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

app.get("/api/users/:userId/logs", (req, res) => {

  const userId = req.params.userId;
  const from = req.query.from || new Date('1970-1-1');
  const to = req.query.to || new Date('2050-12-31');
  const limit = parseInt(req.query.limit) || 1000;

  userRepository.findById(userId, (err, user) => {
    if (err) {
      res.json({ error: `Error getting user with id "${userId}": ${err}`});
      return;
    }

    if (!user) {
      res.json({ error: `User with id "${userId}" does not exist`});
      return;
    }

    exerciseRepository.getExercisesByUserId(userId, from, to, limit, (err, exercises) => {
      if (err) {
        res.json({ error: `Error gettings exercises from user "${userId}": ${err}`});
        return;
      }

      res.json({
        _id: user._id,
        username: user.username,
        count: exercises.length,
        log: exercises.map(exercise => {
          return {
            description: exercise.description,
            duration: exercise.duration,
            date: exercise.date.toDateString()
          }
        })
      });
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
