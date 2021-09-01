require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const mongoose = require("mongoose");
const dns = require("dns");
// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use("/public", express.static(`${process.cwd()}/public`));

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

//Db
const urlSchema = mongoose.Schema({
  _id: Number,
  url: String,
});

const urlMapModel = mongoose.model("urlmap", urlSchema);

async function connectToDb() {
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
}

async function addEntry(toAdd) {
  const newUrl = new urlMapModel(toAdd);
  await newUrl.save();
}

async function getEntry(id) {
  const res = await urlMapModel.find({ _id: id });
  return res;
}

async function getSizeOfDb() {
  const list = await urlMapModel.find();
  return list.length;
}

connectToDb()
  .then(() => console.log("successfully connected to Database"))
  .catch((err) => console.log(err));

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

app.get("/api/hello", function (req, res) {
  res.json({ greeting: "hello API" });
});

app.post("/api/shorturl", function (req, res) {
  let url = req.body.url;

  const regex = /^https?:\/\//i;

  const match = url.match(regex);

  if (!match) {
    res.json({
      error: "invalid url",
    });
  } else {
    formUrl = url.replace(regex, "");

    dns.lookup(formUrl, (err, address, family) => {
      if (err)
        res.json({
          error: "invalid url",
        });
      else {
        let short_url = -1;

        getSizeOfDb()
          .then((len) => {
            short_url = len;
            addEntry({ _id: len, url: formUrl }).catch((err) =>
              console.log(err)
            );
            res.json({
              original_url: url,
              short_url: short_url,
            });
          })
          .catch((err) => console.log(err));
      }
    });
  }
});

app.get("/api/shorturl/:id", function (req, res) {
  getEntry({ _id: req.params.id })
    .then((res) => console.log(res))
    .catch((err) => console.log(err));
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
