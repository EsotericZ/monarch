const express = require('express');
const cors = require('cors');

const app = express();
let routes = require('./routes/api/routes');

app.use(
    cors({
      origin: true,
      methods: ["GET", "POST", "PUT", "DELETE"],
      credentials: true,
    })
  );

app.use(express.static("public"));

app.use("/", routes);
// let server = app.listen(process.env.SERVER_PORT || 3001);
let server = app.listen(3001);