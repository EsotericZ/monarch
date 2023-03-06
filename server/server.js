const express = require('express');
const bodyParser = require('body-parser');
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


app.use(
  bodyParser.json({
    verify: (req, res, buf, encoding) => {
      try {
        JSON.parse(buf);
      } catch (e) {
        res.status(404).send({
          status: "error",
          description: "invalid json",
        });
        throw Error("invalid JSON");
      }
    },
  })
);
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(upload.array());
// app.use(express.static("public"));
// app.use(favicon(__dirname + "/public/images/favicon.png"));




app.use(express.static("public"));

app.use("/", routes);
// let server = app.listen(process.env.SERVER_PORT || 3001);
let server = app.listen(3001);