const mongoose = require('mongoose')

//=========================// isValidEmail //===================================

const isValidEmail = function (value) {
  let emailRegex =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-z\-0-9]+\.)+[a-z]{2,}))$/;
  if (emailRegex.test(value)) return true;
};

//============================// idCharacterValid //============================

const isValidObjectId = function (objectId) {
  var valid = mongoose.Types.ObjectId.isValid(objectId)
  if (!valid) { return false }
  else { return true }
}

//==========================// isValidString //==================================

const isValidString = function (value) {
  if (typeof value === "undefined" || value === null) return false;
  if (typeof value !== "string") return false;
  if (value.trim().length === 0) return false;
  return true;
};

//==============================// isValidName //================================

const isValidName = function (name) {

  if (name.trim().length === 0) { return false }
  if (/^[a-zA-Z ,.'-]+$/.test(name)) {
    return true;
  }
  return false
};

//==============================// isValidMobile //===============================

const isValidMobile = function (mobile) {
  if (/^[0]?[6789]\d{9}$/.test(mobile)) {
    return true
  }
  return false
}

//==============================// isValidPincode //===============================

const isValidPincode = function (pincode) {
  if (/^[1-9][0-9]{5}$/.test(pincode)) {
    return true
  }
  return false
}

//==============================// isValidPassword //===============================

const isValidPassword = function (pwd) {
  let passwordRegex =
    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,15}$/;
  if (passwordRegex.test(pwd)) {
    return true;
  } else {
    return false;
  }
}

//=============================// isValidImage //==============================

const isValidImage = function (value) {
  let imageRegex = /\.(gif|jpe?g|tiff?|png|webp|bmp)$/i

  if (imageRegex.test(value)) {
    return true
  }
}

const isNumber = function (value) {
  if (typeof (value) === 'undefined' || typeof (value) === 'null') return false
  if (typeof (value) === 'number') return true

}
//=======
const isValidSize = function (value) {
  let enumValue = ["S", "XS", "M", "X", "L", "XXL", "XL"]
  for (let x of value) {
    if (enumValue.includes(x) == false) return false
  }
  return true;
}

//=============================// module exports //==============================

module.exports = { isNumber, isValidSize, isValidEmail, isValidObjectId, isValidString, isValidPassword, isValidName, isValidMobile, isValidPincode, isValidImage }
