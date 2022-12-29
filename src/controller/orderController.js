const userModel = require("../model/userModel")
const productModel = require("../model/productModel")
const cartModel = require("../model/cartModel")
const { isValidObjectId } = require("../validator/validator")
const orderModel = require("../model/orderModel")


//=====================================// CREATE ORDER //==================================//

const createOrder = async function (req, res) {
    try {
        let userId = req.params.userId
        let cartId = req.body.cartId
        if (!cartId) {
            return res.status(400).send({ status: false, message: "provide cartId in body" })
        }
        if (!isValidObjectId(cartId)) {
            return res.status(400).send({ status: false, message: "invalid cartId" })
        }
        const findCart = await cartModel.findById(cartId)
        if (!findCart) {
            return res.status(404).send({ status: false, message: "Cart dose not Exists" })
        }
        let cartUserId = findCart.userId
        if (!userId == cartUserId) {
            return res.status(400).send({
                status: false, message: `Please provide  user valid cartId ${findCart._id}`
            })
        }
        if (findCart.items.length == 0) return res.status(400).send({ status: false, message: "Your cart is empty", data: findCart })

        let itemArray = findCart.items
        for (let i = 0; i < itemArray.length; i++) {
            let product = await productModel.findOne({ _id: itemArray[i].productId })
            if (product.isDeleted) {
                findCart.totalPrice = findCart.totalPrice - (itemArray[i].quantity * product.price)
                itemArray.splice(itemArray[i], 1)
            }
        }

        // Total Price && Quantity =>
        let totalPrice = findCart.totalPrice;
        let totalQuantity = 0;
        for (let j = 0; j < itemArray.length; j++) {
            totalQuantity = totalQuantity + itemArray[j].quantity
        }

        let order = {
            userId: userId,
            items: itemArray,
            totalPrice: totalPrice,
            totalItems: itemArray.length,
            totalQuantity: totalQuantity,
            cancellable: req.body.cancellable
        }

        const createOrder = await orderModel.create(order)
        await cartModel.findOneAndUpdate({ userId: userId }, { $set: { items: [], totalPrice: 0, totalItems: 0 } })
        return res.status(201).send({ status: true, message: 'Success', data: createOrder })
    }
    catch (err) {
        return res.status(500).send({ status: false, message: err.message })

    }
}


//=====================================// UPDATE ORDER //==================================//

const updateOrder = async function (req, res) {
    try {
        const userId = req.params.userId;
        const data = req.body;

        if (Object.keys(data).length == 0) return res.status(400).send({ status: false, message: 'Please provide Data in request body' })

        const { orderId, status } = data
        if (status != "pending" && status != "completed" && status != "canceled") {
            return res.status(400).send({ status: false, message: "order status can only be pending,completed and canceled" })
        }

        const findOrder = await orderModel.findById(orderId)
        if (!findOrder) return res.status(404).send({ status: false, message: "oder Not found" })

        if (findOrder.status == "completed")
            return res.status(400).send({ status: false, message: "Can Not Update This Order, Because It's Completed Already" })

        if (findOrder.status == "canceled")
            return res.status(400).send({ status: false, message: "Can Not Update This Order, Because It's Cancelled Already" })

        if (findOrder.userId != userId) return res.status(403).send({ status: false, message: "order is not blong to the user " })

        if (status == "canceled") {
            // if(findOrder.cancellable==false)
            if (!findOrder.cancellable) return res.status(400).send({ status: false, message: "This order is not cancellable" })
        }
        const updateOrder = await orderModel.findOneAndUpdate({ _id: orderId }, { $set: { status: status } }, { new: true })

        return res.status(200).send({ status: true, message: "Success", data: updateOrder })
    }
    catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}

module.exports = { createOrder, updateOrder }
