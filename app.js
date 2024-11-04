const express = require("express");
const app = express();
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const path = require("path");
const ejsMate = require("ejs-mate");
const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
  .then(() => {
    console.log("connect to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "public")));

app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);

app.use((err, req, res, next) => {
  let { statuscode = 500, message = "Something Went Wrong" } = err;
  // res.status(statuscode).send(message);
  res.status(statuscode).render("error.ejs", { err });
});

app.listen(8080, () => {
  console.log("server is listing to port");
});
