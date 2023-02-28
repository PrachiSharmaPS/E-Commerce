

const mongoose = require('mongoose')

const objectId = mongoose.Schema.Types.ObjectId

const orderSchema = new mongoose.Schema({

    userId: { type: objectId, ref: 'user', required: true, trim: true },
    items: [{
        productId: { type: objectId, ref: 'product', required: true },
        quantity: { type: Number, required: true, min: 1 }
    }],
    totalPrice: { type: Number, required: true },
    totalItems: { type: Number, required: true },
    totalQuantity: { type: Number, required: true },
    cancellable: { type: Boolean, default: true },
    status: { type: String, default: 'pending', enum: ['pending', 'completed', 'canceled'] },
    deletedAt: { type: Date },
    isDeleted: { type: Boolean, default: false }
}, { timestamps: true })


module.exports = mongoose.model("order", orderSchema)
