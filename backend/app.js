const express = require('express');
const app = express();
const cors = require('cors');
const { sequelize } = require('./models');
const sheltersRouter = require('./routes/shelters');
const routeCalculationRouter = require('./routes/routeCalculation');

app.use(cors());
app.use(express.json());
app.use('/api/shelters', sheltersRouter);
app.use('/api/calculate-route', routeCalculationRouter);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection to the database has been established successfully.');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

startServer();
