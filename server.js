const express = require('express');
require('dotenv').config({ path: './config/config.env' });
const bootcamps = require('./routes/bootcamps');
const morgan = require('morgan');
const colors = require('colors');
const errorHandler = require('./middleware/errors-handler');
const courses = require('./routes/courses');
const connectDB = require('./config/db');

// connect to the database
connectDB();

const app = express();

//Body Parse
app.use(express.json());

// set Morgan logger
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

//Mount Routers
app.use('/api/v1/bootcamps', bootcamps);
app.use('/api/v1/courses', courses);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(
    `Server listening in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow
      .bold
  );
});

// Handle unhandled promise rejection
process.on('uncaughtException', (err, promise) => {
  console.log(`Error: ${err.message}`);

  //Close server & exit process
  server.close(() => {
    process.exit(1);
  });
});
