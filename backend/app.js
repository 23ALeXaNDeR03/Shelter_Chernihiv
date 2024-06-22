const express = require('express');
const app = express();
const sheltersRouter = require('./routes/shelters');

app.use(express.json());
app.use('/api/shelters', sheltersRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
