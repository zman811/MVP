const mongoose = require("mongoose");
mongoose.connect(process.env.MONGODB);

let champSchema = mongoose.Schema({});

module.exports = mongoose.models.Champ || mongoose.model("Champ", champSchema);