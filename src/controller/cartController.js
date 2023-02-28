const cartModel = require("../model/cartModel");
const productModel = require("../model/productModel");
const { isValidObjectId, isNumber } = require("../validator/validator");


// <<<<<<<<------------------- Create-Cart-Api ------------------ >>>>>>>>>>>>>

const addToCart = async function (req, res) {
    try {
        const userId = req.params.userId;
        const data = req.body;
        let quantity = data.quantity;
        const { productId, cartId } = data;

        if (Object.keys(data).length == 0) { return res.status(400).send({ status: false, message: "Put the productId you want to add to Cart" }) }
        if (!isValidObjectId(productId)) { return res.status(400).send({ status: false, message: "product id not valid id" }) }
        if (!isNumber(quantity)) { quantity = 1 }
        const productDetails = await productModel.findOne({ _id: productId, isDeleted: false })
        if (!productDetails) return res.status(404).send({ status: false, message: "No product Found" })
        let newCart = false
        if (!cartId) {
            let theCarts = await cartModel.findOne({ userId: userId });
            if (theCarts) { return res.status(409).send({ status: false, message: `Cart is Already exists, put ${theCarts._id} this cartId in the body` }) };
            let cartCreate = {
                userId: userId,
                items: [],
                totalPrice: 0,
                totalItems: 0
            }
            var cartDetails = await cartModel.create(cartCreate)
            newCart = true
        }
        else {
            if (!isValidObjectId(cartId)) { return res.status(400).send({ status: false, message: "cart id not valid id" }) };
            var cartDetails = await cartModel.findOne({ _id: cartId })
            if (!cartDetails) { return res.status(404).send({ status: false, message: `Cart does not found, try with right cartId` }) };
            if (cartDetails.userId != userId) { return res.status(400).send({ status: false, message: `You are not owner of this Cart, please try with ${cartDetails._id} this cartId` }) };
        }
        for (var i = 0; i < cartDetails.items.length; i++) {
            if (cartDetails.items[i].productId == productId) {
                cartDetails.items[i].quantity = cartDetails.items[i].quantity + quantity
                break;
            }
        }
        if (cartDetails.items.length == (i || 0)) {
            cartDetails.items.push({ productId: productId, quantity: quantity })
        }
        cartDetails.totalPrice = cartDetails.totalPrice + (productDetails.price * quantity)
        cartDetails.totalItems = cartDetails.items.length

        let cartData = await cartModel.findOneAndUpdate({ userId: userId }, { ...cartDetails }, { new: true }).select({ __v: 0 })
        if (newCart) {
            return res.status(201).send({ status: true, message: "Success", data: cartData })
        } else {
            return res.status(200).send({ status: true, message: "Success", data: cartData })

        }

    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}

// <<<<<<<<------------------- Update-Cart-Api ----------------- >>>>>>>>>>>>>

const updateCart = async function (req, res) {
    try {
        const userId = req.params.userId;
        const data = req.body
        const { cartId, productId, removeProduct } = data
        if (!cartId) { return res.status(400).send({ status: false, message: "cart id is required" }) }
        if (!productId) { return res.status(400).send({ status: false, message: "product id is required" }) }
        if (!isValidObjectId(cartId)) { return res.status(400).send({ status: false, message: "cart id not valid id" }) }
        if (!isValidObjectId(productId)) { return res.status(400).send({ status: false, message: "product id not valid id" }) }

        if (removeProduct != 0 && removeProduct != 1) { return res.status(400).send({ status: false, message: "removeProduct can be 0 or 1" }) }

        const theCart = await cartModel.findById(cartId)
        if (!theCart) return res.status(404).send({ status: false, message: "Cart does not found" })
        const product = await productModel.findOne({ _id: productId }, { isdeleted: false })
        if (!product) return res.status(404).send({ status: false, message: "Product does not found" })

        const theLength = theCart.items.length
        if (removeProduct == "1") {
            for (var i = 0; i < theLength; i++) {
                //======checking product id in items array====
                if (theCart.items[i].productId == productId) {
                    break;
                }
            }
            if (i == theLength) { return res.status(404).send({ status: false, message: "Product does not exists in your Cart" }) }
            //====decrementing the quantity by 1
            theCart.items[i].quantity = theCart.items[i].quantity - 1
            if (theCart.items[i].quantity < 1) {
                theCart.items.splice(i, 1)
            }
            theCart.totalPrice = theCart.totalPrice - product.price
            theCart.totalItems = theCart.items.length

            let cartData = await cartModel.findOneAndUpdate({ userId: userId }, { $set: { ...theCart } }, { new: true })
            if (theLength != theCart.items.length) {
                return res.status(200).send({ status: true, message: "Success", data: cartData })
            } else {
                return res.status(200).send({ status: true, message: "Success", data: cartData })
            }

        }
        if (removeProduct == "0") {
            for (var j = 0; j < theLength; j++) {
                if (theCart.items[j].productId == productId) {
                    var productCount = theCart.items[j].quantity
                    theCart.items.splice(j, 1)
                    break;
                }
            }
            if (i == theLength) { return res.status(404).send({ status: false, message: "Product does not exists in your Cart" }) }
            theCart.totalPrice = theCart.totalPrice - (product.price * productCount)
            theCart.totalItems = theCart.items.length
            let cartData = await cartModel.findOneAndUpdate({ userId: userId }, { ...theCart }, { new: true })
            return res.status(200).send({ status: true, message: "Product Removed From Your Cart", data: cartData })

        }
    } catch (err) {
        console.log(err)
        return res.status(500).send({ status: false, message: err.message })
    }
}

// <<<<<<<<------------------- get-Cart-Api -------------------- >>>>>>>>>>>>>>>

const getCartSummary = async function (req, res) {
    try {
        let userId = req.params.userId
        if (!isValidObjectId(userId)) return res.status(400).send({ status: false, message: "Invalid userId" })

        const getCart = await cartModel.findOne({ userId: userId }).populate({ path: "items.productId", model: "product" }).select("-__v")
        if (!getCart) { return res.status(404).send({ status: false, message: "Your cart is not found" }) }
        if (getCart.items.length == 0) { return res.status(200).send({ status: true, message: "Your Shopping cart is empty", data: getCart }) }
        return res.send({ status: true, message: "Here is your cart", data: getCart });
    }
    catch (err) {
        return res.status(500).send({ status: false, message: err.message });
    }
}
// <<<<<<<<------------------- delete-Cart-Api -------------------->>>>>>>>>>>>>

const deleteCart = async function (req, res) {
    const userId = req.params.userId;

    let cartDatails = await cartModel.findOne({ userId: userId })

    if (!cartDatails) { return res.status(404).send({ status: false, message: "Cart not found of this User" }) }

    await cartModel.findOneAndUpdate({ userId: userId }, { $set: { items: [], totalPrice: 0, totalItems: 0 } }, { new: true })

    return res.status(204).send({ status: true, message: "Cart has been deleted successfully!" })
}

module.exports = { getCartSummary, deleteCart, addToCart, updateCart };
