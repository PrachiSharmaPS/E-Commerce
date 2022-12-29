const router = require("express").Router();
const userController = require("../controller/userController");
const productController = require("../controller/productController");
const cartController = require("../controller/cartController");
const { updateOrder, createOrder } = require("../controller/orderController");
const auth = require("../middleware/auth")

//<<<<<<<<-------------------  User APIs -------------------->>>>>>>>>>>>>

router.post("/register", userController.registerUser)
router.post("/login", userController.userLogin);
router.get("/user/:userId/profile", auth.authenticate, userController.getUserProfile)
router.put("/user/:userId/profile", auth.authenticate, auth.authorization, userController.updateUserProfile)

//<<<<<<<<------------------- Product APIs -------------------->>>>>>>>>>>>>

router.post("/products", productController.createProduct)
router.get("/products", productController.getproducts)
router.get("/products/:productId", productController.getProductsById)
router.put("/products/:productId", productController.updateProductById)
router.delete("/products/:productId", productController.deleteProduct)

//<<<<<<<<------------------- Cart APIs ----------------------->>>>>>>>>>>>>

router.post("/users/:userId/cart",auth.authenticate,auth.authorization, cartController.addToCart)
router.put("/users/:userId/cart",auth.authenticate,auth.authorization,cartController.updateCart)
router.get("/users/:userId/cart",auth.authenticate,auth.authorization, cartController.getCartSummary)
router.delete("/users/:userId/cart",auth.authenticate,auth.authorization, cartController.deleteCart)

//<<<<<<<<------------------- Order APIs ----------------------->>>>>>>>>>>>>

router.post("/users/:userId/orders", auth.authenticate, auth.authorization, createOrder)
router.put("/users/:userId/orders", auth.authenticate, auth.authorization, updateOrder)



router.all("/*", async function (req, res) {
  return res.status(400).send({ status: false, message: "Path is not valid" });
});



module.exports = router;
