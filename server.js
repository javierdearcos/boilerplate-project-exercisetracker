const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const userRepository = require('./userRepository')

app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use(express.static('public'));
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

app.post("/api/users", (req, res) => {
  
  const username = req.body.username;

  if (!username) {
    res.json({error: '"username" is required in body request'});
    return;
  }

  userRepository.findByUsername(username, (_, existingUser) => {
    if (existingUser) {
      res.json(existingUser);
      return;
    }

    userRepository.createUser(req.body.username, (err, user) => {
      if (err) {
        res.json({ error: `Error creating user ${username}: ${err}`});
        return;
      }
  
      res.json(user);
    });
  });
})

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
