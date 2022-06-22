const mongoose = require("mongoose");
mongoose.connect(process.env.MONGODB);

let champSchema = mongoose.Schema({
  name: String,
  key: String,
  title: String,
  imgId: String,
});

module.exports = mongoose.models.Champ || mongoose.model("Champ", champSchema);
