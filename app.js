const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const ejs = require('ejs');
const cors = require("cors");
require('dotenv').config();
const IndexRouter = require('./routes/index');
const PORT = process.env.PORT || 3000;
const maria = require('./database/connect/maria');
//maria.connect();
maria.getConnection()

const app = express();

app.set('view engine', 'ejs');
app.set('views', './views');

app.use(cors());
app.use(express.json());

app.use('/api/',IndexRouter);

// 서버를 시작합니다.
app.listen(PORT, () => {
  console.log('Server listening on port ' + PORT || 3000);
});