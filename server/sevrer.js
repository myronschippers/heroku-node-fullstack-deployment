const express = require('express');
const bodyParser = require('body-parser');

const app = express();
// Looks for the Deployment environment PORT before
// assigning a PORT for local development.
const PORT = process.env.PORT || 5000;

// IMPORT ROUTER MODULES
// const tasksRouter = require('./routers/tasks.router');

app.use(express.static('server/public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// DEFINE ROUTER USAGE
// app.use('/api/tasks', tasksRouter);

app.listen(PORT, () => {
    console.log('Listening on port: ', PORT);
});
