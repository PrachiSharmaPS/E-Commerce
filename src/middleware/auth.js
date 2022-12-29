// authentication
const jwt = require("jsonwebtoken")
const { isValidObjectId } = require("../validator/validator")
const userModel = require("../model/userModel")

//================================================Authentication======================================================//

const authenticate = function (req, res, next) {
    try {
        const Bearer = req.headers["authorization"]  // token from headers
        if (!Bearer) {
            return res.status(400).send({ status: false, message: "token must be present" })
        }
        else {
            const token = Bearer.split(" ")
            if (token[0] !== "Bearer") {
                return res.status(400).send({ status: false, message: "Select Bearer Token in headers" })
            }
            jwt.verify(token[1], "the-secret-key", function (err, decodedToken) {

                if (err) {
                    if (err.message == "invalid token" || err.message == "invalid signature") {
                        return res.status(401).send({ status: false, message: "Token in not valid" })
                    }
                    if (err.message == "jwt expired") {
                        return res.status(401).send({ status: false, message: "Token has been expired" })
                    }
                    return res.status(401).send({ status: false, message: err.message })
                }
                else {
                    req.loginUserId = decodedToken.userId       // golbelly  in  decodedToken.userId 
                    next()
                }
            })
        }
    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

//===============================================Authorization====================================================//


const authorization = async function (req, res, next) {
    try {
        const userId = req.params.userId
        if (!isValidObjectId(userId)) { return res.status(400).send({ status: false, message: 'Please provide a valid UserId' }) }
        let user = await userModel.findById(userId)
        if (!user) { return res.status(404).send({ status: false, message: 'User does not exists' }) }
        req.userData = user
        let tokenUserId = req.loginUserId // token Id
        if (tokenUserId != userId) { return res.status(403).send({ status: false, message: "You are not authorised to perform this task" }) }
        next();
    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}



module.exports = { authenticate, authorization }