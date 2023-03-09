const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

let routes = require('./routes/api/routes');

app.use(
  cors({
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  })
);

app.use(
  bodyParser.json({
    verify: (req, res, buf, encoding) => {
      try {
        JSON.parse(buf);
      } catch (e) {
        res.status(404).send({
          status: 'error',
          description: 'Invalid JSON',
        });
        throw Error('Invalid JSON');
      }
    },
  })
);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use("/", routes);
// let server = app.listen(process.env.SERVER_PORT || 3001);
app.listen(3001);
// app.listen('3001', '10.0.1.26', () => {
//   console.log('Server Started')
// });