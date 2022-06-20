const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/champ");

const db = mongoose.connection;

const champSchema = mongoose.Schema({});

const Champ = mongoose.model("Champ", champSchema);

module.exports = Champ;
