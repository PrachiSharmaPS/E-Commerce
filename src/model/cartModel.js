const mongoose = require("mongoose")
const objectId = mongoose.Schema.Types.ObjectId

const cartShema = new mongoose.Schema({
    userId: {
        type: objectId,
        ref: "User"
    },
    items: [{
        productId: { type: objectId, ref: "product" },
        quantity: { type: Number, require: true },
        _id: false
    }],
    totalPrice: { type: Number, require: true },
    totalItems: { type: Number, require: true },
    __v: false

}, { timestamps: true })

module.exports = mongoose.model("cart", cartShema)
