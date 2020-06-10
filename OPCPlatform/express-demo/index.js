const Joi = require('joi');
const express = require('express');
const app = express();

app.use(express.json());

const environments =[
  {environment_id: 1, environment_name: 'client'},
  {environment_id: 2, environment_name: 'trial'},
  {environment_id: 3, environment_name: 'master'},
]
app.get('/',(req, res) => {
  res.send('Hello World');
});

app.get('/api/environment', (req,res) => {
  res.send(Environments);
});

app.post('/api/environments', (req, res) => {
  const {error } = validateEnvironment(req.body); // result.error
  if (error) {
    // 400 Bad Request
    return res.status(400).send(result.error.details[0].message);
  }
  const environment = {
    environment_id: Environments.length + 1,
    environment_name: req.body.environment_name
  };
  environments.push(environment);
  res.send(environment);
});

app.put('/api/environment/:environment_id', (req, res) => {
  //Look up the environment, if not existing, return 404
  const environment = Environments.find(c => c.id === parseInt(req.params.environment_id));
  if(!environment) {
    res.status(404).send('Environment with the given ID was not found.');
  }
  //validate: if invalid, return 400 - Bad request
  const result = validateEnvironment(req.body);
  const {error } = validateEnvironment(req.body); // result.error
  if (error) {
    // 400 Bad Request
    return res.status(400).send(result.error.details[0].message);
  }
  //Update environment, Return the updated environment
  environment.environment_name = req.body.environment_name;
  res.send(environment);
});

function validateEnvironment(environment) {
  const schema = {
    name: Joi.string().min(3).required()
  };
  return Joi.validate(environment, schema);
}

app.get('/api/environment/:environment_id', (req, res) => {
  const environment = Environments.find(c => c.id === parseInt(req.params.environment_id));
  if(!environment) {
    return res.status(404).send('Environment with the given ID was not found.');

  }
  res.send(environment);
});

app.delete('/api/environment/:environment_id', (req, res) => {
  const environment = Environments.find(c => c.id === parseInt(req.params.environment_id));
  if(!environment) {
    return res.status(404).send('Environment with the given ID was not found.');
  }
  //Delete
  const index = environments.indexOf(environment);
  environments.splice(index, 1);
  //Return the same environment
  res.send(environment);
})

//port
const port = process.env.PORT || 3000;
app.listen(port, () => console.log('Listening on port '+ port + '...'));


