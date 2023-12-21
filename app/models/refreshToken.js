const mongoose = require("mongoose");

const refreshTokenModel = new mongoose.Schema({
    token: {
        type: String,
        required: true,
    },
    account: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "accounts",
    },
    expiredDate: {
        type: Date,
        required: true,
    }
});

module.exports = mongoose.model("refreshToken", refreshTokenModel);
