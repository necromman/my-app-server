const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const ejs = require('ejs');
const IndexRouter = require('./routes/index');
const maria = require('./database/connect/maria');
maria.connect();

const app = express();
app.set('view engine', 'ejs');
app.set('views', './views');
app.use(bodyParser.json());

app.use('/',IndexRouter);
app.use('/users',IndexRouter);
app.use('/login',IndexRouter);
app.use('/signupProcess',IndexRouter);


// 서버를 시작합니다.
app.listen(3000, () => {
  console.log('Server listening on port 3000');
});