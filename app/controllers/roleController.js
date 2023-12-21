const mongoose = require("mongoose");

const roleModel = new mongoose.Schema({
  _id: mongoose.Types.ObjectId,
  name: {
    type: String,
    unique: true,
    required: true
  }
});

module.exports = mongoose.model("roles", roleModel);
